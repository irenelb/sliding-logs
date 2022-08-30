cnf ?= make.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))
.PHONY: help

help: ## get help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	echo ${MAKEFLAGS}
.DEFAULT_GOAL := help


start: ## make build tag=${DEFAULT_IMAGE_TAG}
	docker-compose -f docker-compose.yml -f docker-compose-services.yml -p sliding-logs up
services: ## make build tag=${DEFAULT_IMAGE_TAG}
	docker-compose -f docker-compose-services.yml -p sliding-logs up
services-d: ## make build tag=${DEFAULT_IMAGE_TAG}
	docker-compose -f docker-compose-services.yml -p sliding-logs up -d
mongodb-dump: ## push on docker registry
	docker exec sliding-logs_mongo_1 sh -c 'exec mongodump -u root -p example --archive' > ./backups/mongodb.dump
mongodb-restore: ## push on docker registry
	docker exec -i sliding-logs_mongo_1 sh -c 'exec mongorestore --drop --preserveUUID -u root -p example --archive' < ./backups/mongodb.dump
