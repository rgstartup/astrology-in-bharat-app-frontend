APP ?= client

.PHONY: help dev dev-build dev-d prod prod-build down down-v logs ps sh run exec

help:
	@echo "Frontend Docker Commands (APP=$(APP)):"
	@echo "  make dev [APP=..]         - Start frontend in development mode (hot-reloading)"
	@echo "  make dev-build [APP=..]   - Rebuild and start development container"
	@echo "  make dev-d [APP=..]       - Start development container in background"
	@echo "  make prod [APP=..]        - Start frontend in production mode"
	@echo "  make prod-build [APP=..]  - Rebuild and start production container"
	@echo "  make down [APP=..]        - Stop frontend containers"
	@echo "  make down-v [APP=..]      - Stop and remove volumes"
	@echo "  make logs [APP=..]        - Follow container logs"
	@echo "  make ps                   - List running frontend containers"
	@echo "  make sh [APP=..]          - Open interactive shell inside frontend container"
	@echo "  make exec CMD=\"..\" [APP=..] - Execute a command inside the running frontend container"
	@echo "  make run CMD=\"..\" [APP=..]  - Run a one-off command without starting dependencies"
	@echo ""
	@echo "Apps: client (3000), admin (3001), expert (3003), commerce (3004), agent (8000)"

dev:
	docker compose --profile $(APP)-dev up

dev-build:
	docker compose --profile $(APP)-dev up --build

dev-d:
	docker compose --profile $(APP)-dev up -d

prod:
	docker compose --profile $(APP)-prod up -d

prod-build:
	docker compose --profile $(APP)-prod up --build -d

down:
	docker compose --profile $(APP)-dev --profile $(APP)-prod down

down-v:
	docker compose --profile $(APP)-dev --profile $(APP)-prod down -v

logs:
	docker compose --profile $(APP)-dev --profile $(APP)-prod logs -f

ps:
	docker compose ps -a --filter "name=aib-frontend-*"

# Shell inside running container
sh:
	docker exec -it aib-frontend-$(APP)-dev sh

# Execute command inside running container
exec:
	docker exec -it aib-frontend-$(APP)-dev $(CMD)

# Run a one-off command in a temporary container without starting dependent service containers
run:
	docker compose --profile $(APP)-dev run --no-deps --rm $(APP)-dev $(CMD)
