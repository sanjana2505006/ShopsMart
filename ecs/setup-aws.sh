#!/bin/bash
# =============================================================
# SmartShop - AWS ECR + ECS One-Time Setup Script
# Run this ONCE to create all AWS infrastructure.
# After this, GitHub Actions handles all future deployments.
# =============================================================
# BEFORE RUNNING:
#   1. aws configure   (set your Access Key, Secret, region)
#   2. Fill in your values below
# =============================================================

set -e  # Exit on any error

# ── CONFIG — Fill these in ──────────────────────────────────
REGION="ap-south-1"                    # ← Your AWS region
CLUSTER_NAME="smartshop-cluster"
BACKEND_REPO="smartshop-backend"
FRONTEND_REPO="smartshop-frontend"
BACKEND_SERVICE="smartshop-backend-service"
FRONTEND_SERVICE="smartshop-frontend-service"
VPC_ID=""                              # ← Your VPC ID (aws ec2 describe-vpcs)
SUBNET_1=""                            # ← Subnet ID 1
SUBNET_2=""                            # ← Subnet ID 2
# ────────────────────────────────────────────────────────────

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_BASE="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

echo "========================================"
echo " SmartShop AWS Setup"
echo " Account: $ACCOUNT_ID | Region: $REGION"
echo "========================================"

# ── STEP 1: ECR Repositories ──────────────────────────────
echo ""
echo "[1/7] Creating ECR repositories..."

aws ecr create-repository \
  --repository-name $BACKEND_REPO \
  --region $REGION \
  --image-scanning-configuration scanOnPush=true \
  2>/dev/null && echo "  ✓ Backend ECR repo created" || echo "  ⚠ Backend ECR repo already exists"

aws ecr create-repository \
  --repository-name $FRONTEND_REPO \
  --region $REGION \
  --image-scanning-configuration scanOnPush=true \
  2>/dev/null && echo "  ✓ Frontend ECR repo created" || echo "  ⚠ Frontend ECR repo already exists"

# ── STEP 2: ECS Cluster ───────────────────────────────────
echo ""
echo "[2/7] Creating ECS cluster..."

aws ecs create-cluster \
  --cluster-name $CLUSTER_NAME \
  --capacity-providers FARGATE \
  --region $REGION \
  2>/dev/null && echo "  ✓ Cluster created" || echo "  ⚠ Cluster already exists"

# ── STEP 3: IAM Role ──────────────────────────────────────
echo ""
echo "[3/7] Checking ECS Task Execution Role..."

aws iam get-role --role-name ecsTaskExecutionRole > /dev/null 2>&1 || {
  echo "  Creating ecsTaskExecutionRole..."
  aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document '{
      "Version":"2012-10-17",
      "Statement":[{
        "Effect":"Allow",
        "Principal":{"Service":"ecs-tasks.amazonaws.com"},
        "Action":"sts:AssumeRole"
      }]
    }'
  aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
  aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess
}
echo "  ✓ ecsTaskExecutionRole is ready"

# ── STEP 4: SSM Parameter for JWT Secret ──────────────────
echo ""
echo "[4/7] Storing JWT secret in SSM Parameter Store..."

JWT_SECRET=$(openssl rand -base64 48)
aws ssm put-parameter \
  --name "/smartshop/jwt-secret" \
  --value "$JWT_SECRET" \
  --type "SecureString" \
  --region $REGION \
  --overwrite \
  && echo "  ✓ JWT_SECRET stored in SSM: /smartshop/jwt-secret"

# ── STEP 5: CloudWatch Log Groups ─────────────────────────
echo ""
echo "[5/7] Creating CloudWatch log groups..."

aws logs create-log-group --log-group-name /ecs/smartshop-backend --region $REGION 2>/dev/null
aws logs create-log-group --log-group-name /ecs/smartshop-frontend --region $REGION 2>/dev/null
echo "  ✓ Log groups ready"

# ── STEP 6: Security Groups ───────────────────────────────
echo ""
echo "[6/7] Creating Security Groups..."

BACKEND_SG=$(aws ec2 create-security-group \
  --group-name smartshop-backend-sg \
  --description "SmartShop Backend Security Group" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --query GroupId --output text 2>/dev/null || \
  aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=smartshop-backend-sg" \
    --query "SecurityGroups[0].GroupId" --output text --region $REGION)

FRONTEND_SG=$(aws ec2 create-security-group \
  --group-name smartshop-frontend-sg \
  --description "SmartShop Frontend Security Group" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --query GroupId --output text 2>/dev/null || \
  aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=smartshop-frontend-sg" \
    --query "SecurityGroups[0].GroupId" --output text --region $REGION)

# Allow inbound on port 5001 for backend
aws ec2 authorize-security-group-ingress \
  --group-id $BACKEND_SG \
  --protocol tcp --port 5001 --cidr 0.0.0.0/0 \
  --region $REGION 2>/dev/null || true

# Allow inbound on port 80 for frontend
aws ec2 authorize-security-group-ingress \
  --group-id $FRONTEND_SG \
  --protocol tcp --port 80 --cidr 0.0.0.0/0 \
  --region $REGION 2>/dev/null || true

echo "  ✓ Security groups ready"
echo "  Backend SG:  $BACKEND_SG"
echo "  Frontend SG: $FRONTEND_SG"

# ── STEP 7: Initial Docker Build & Push ───────────────────
echo ""
echo "[7/7] Building and pushing Docker images..."

aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ECR_BASE

# Backend
echo "  Building backend..."
cd server
docker build -t $BACKEND_REPO .
docker tag $BACKEND_REPO:latest $ECR_BASE/$BACKEND_REPO:latest
docker push $ECR_BASE/$BACKEND_REPO:latest
cd ..

echo "  Building frontend (using placeholder API URL — update after ALB is created)..."
cd client
docker build \
  --build-arg VITE_API_URL=http://REPLACE_WITH_BACKEND_ALB_URL \
  -t $FRONTEND_REPO .
docker tag $FRONTEND_REPO:latest $ECR_BASE/$FRONTEND_REPO:latest
docker push $ECR_BASE/$FRONTEND_REPO:latest
cd ..

# ── PRINT SUMMARY ─────────────────────────────────────────
echo ""
echo "========================================"
echo " ✅ Setup Complete!"
echo "========================================"
echo ""
echo " ECR Images pushed:"
echo "   $ECR_BASE/$BACKEND_REPO:latest"
echo "   $ECR_BASE/$FRONTEND_REPO:latest"
echo ""
echo " Next steps:"
echo "   1. Update ecs/backend-task-definition.json:"
echo "      - Replace YOUR_ACCOUNT_ID with: $ACCOUNT_ID"
echo "      - Replace YOUR_EFS_ID after creating EFS (optional)"
echo "      - Backend SG: $BACKEND_SG"
echo ""
echo "   2. Register task definitions:"
echo "      aws ecs register-task-definition --cli-input-json file://ecs/backend-task-definition.json"
echo "      aws ecs register-task-definition --cli-input-json file://ecs/frontend-task-definition.json"
echo ""
echo "   3. Create ECS services:"
echo "      See CREATE_SERVICES.md for commands with your subnet/SG IDs"
echo ""
echo "   4. Add GitHub Secrets (Settings → Secrets → Actions):"
echo "      AWS_ACCESS_KEY_ID     = your key"
echo "      AWS_SECRET_ACCESS_KEY = your secret"
echo "      VITE_API_URL          = your backend ALB URL"
echo ""
echo "   5. Push to main branch — GitHub Actions deploys automatically!"
