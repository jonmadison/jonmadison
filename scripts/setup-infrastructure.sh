#!/bin/bash

# Infrastructure setup script for jonmadison.com
# This script deploys the CDK infrastructure (S3, CloudFront, SSL certificates)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏗️  Setting up infrastructure for jonmadison.com...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if infrastructure directory exists
if [ ! -d "infrastructure" ]; then
    echo -e "${RED}❌ Error: infrastructure directory not found.${NC}"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Error: AWS CLI is not installed or not in PATH.${NC}"
    echo -e "${YELLOW}   Please install AWS CLI: https://aws.amazon.com/cli/${NC}"
    exit 1
fi

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo -e "${YELLOW}⚠️  CDK CLI not found. Installing globally...${NC}"
    npm install -g aws-cdk
fi

# Check AWS credentials
if ! aws sts get-caller-identity --profile jon &> /dev/null; then
    echo -e "${RED}❌ Error: AWS credentials not configured for profile 'jon'.${NC}"
    echo -e "${YELLOW}   Please run 'aws configure --profile jon' to set up your credentials.${NC}"
    exit 1
fi

# Set AWS profile for CDK
export AWS_PROFILE=jon

# Navigate to infrastructure directory
cd infrastructure

# Install dependencies
echo -e "${YELLOW}📦 Installing CDK dependencies...${NC}"
npm install

# Bootstrap CDK (if not already done)
echo -e "${YELLOW}🚀 Bootstrapping CDK...${NC}"
cdk bootstrap

# Deploy the stack
echo -e "${YELLOW}🏗️  Deploying infrastructure stack...${NC}"
cdk deploy --require-approval never

echo -e "${GREEN}✅ Infrastructure deployment completed!${NC}"

# Get the outputs
echo -e "${BLUE}📋 Retrieving deployment outputs...${NC}"
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name JonMadisonSiteStack --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text --profile jon)
DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name JonMadisonSiteStack --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text --profile jon)
DISTRIBUTION_DOMAIN=$(aws cloudformation describe-stacks --stack-name JonMadisonSiteStack --query 'Stacks[0].Outputs[?OutputKey==`DistributionDomainName`].OutputValue' --output text --profile jon)

echo -e "${GREEN}🎉 Infrastructure setup completed successfully!${NC}"
echo -e "${BLUE}📊 Deployment Details:${NC}"
echo -e "   S3 Bucket: ${GREEN}$BUCKET_NAME${NC}"
echo -e "   CloudFront Distribution ID: ${GREEN}$DISTRIBUTION_ID${NC}"
echo -e "   CloudFront Domain: ${GREEN}$DISTRIBUTION_DOMAIN${NC}"

# Update deployment scripts with the distribution ID
cd ..
echo -e "${YELLOW}🔧 Updating deployment scripts with distribution ID...${NC}"
sed -i.bak "s/DISTRIBUTION_ID=\"\"/DISTRIBUTION_ID=\"$DISTRIBUTION_ID\"/" scripts/deploy.sh
sed -i.bak "s/DISTRIBUTION_ID=\"\"/DISTRIBUTION_ID=\"$DISTRIBUTION_ID\"/" scripts/invalidate-cache.sh

# Make scripts executable
chmod +x scripts/deploy.sh
chmod +x scripts/invalidate-cache.sh

echo -e "${GREEN}✅ Scripts updated and made executable!${NC}"

echo -e "${BLUE}🌐 Next Steps:${NC}"
echo -e "1. ${YELLOW}Configure DNS in DreamHost:${NC}"
echo -e "   - Add CNAME record: ${GREEN}jonmadison.com${NC} -> ${GREEN}$DISTRIBUTION_DOMAIN${NC}"
echo -e "   - Add CNAME record: ${GREEN}www.jonmadison.com${NC} -> ${GREEN}$DISTRIBUTION_DOMAIN${NC}"
echo -e ""
echo -e "2. ${YELLOW}Wait for SSL certificate validation${NC} (this can take up to 30 minutes)"
echo -e ""
echo -e "3. ${YELLOW}Deploy your site:${NC}"
echo -e "   ${GREEN}./scripts/deploy.sh${NC}"
echo -e ""
echo -e "4. ${YELLOW}For future deployments, use:${NC}"
echo -e "   ${GREEN}./scripts/deploy.sh${NC} (builds and deploys)"
echo -e "   ${GREEN}./scripts/invalidate-cache.sh${NC} (cache invalidation only)"

echo -e "${GREEN}🎉 Setup complete! Your infrastructure is ready.${NC}"
