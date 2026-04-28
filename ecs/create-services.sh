#!/bin/bash

# Script to create ECS services for ShopSmart
# Run this once after setting up your ECS cluster

set -e

AWS_REGION="us-east-1"
CLUSTER_NAME="shopsmart-cluster"
VPC_ID="vpc-xxxxxxxxx"  # Replace with your VPC ID
SUBNET_1="subnet-xxxxxxxxx"  # Replace with your subnet ID
SUBNET_2="subnet-yyyyyyyyy"  # Replace with your subnet ID
SECURITY_GROUP="sg-xxxxxxxxx"  # Replace with your security group ID

echo "Creating backend service..."
aws ecs create-service \
  --cluster $CLUSTER_NAME \
  --service-name shopsmart-backend-service \
  --task-definition shopsmart-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:$AWS_REGION:YOUR_ACCOUNT_ID:targetgroup/shopsmart-backend-tg/xxxxxxxxx,containerName=shopsmart-backend,containerPort=5001" \
  --region $AWS_REGION

echo "Creating frontend service..."
aws ecs create-service \
  --cluster $CLUSTER_NAME \
  --service-name shopsmart-frontend-service \
  --task-definition shopsmart-frontend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:$AWS_REGION:YOUR_ACCOUNT_ID:targetgroup/shopsmart-frontend-tg/xxxxxxxxx,containerName=shopsmart-frontend,containerPort=80" \
  --region $AWS_REGION

echo "Services created successfully!"
