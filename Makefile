.PHONY: help dev dev-build dev-d prod prod-build down down-v logs ps sh run exec

help:
	@echo "Frontend Docker Commands:"
	@echo "  make dev         - Start frontend in development mode (hot-reloading)"
	@echo "  make dev-build   - Rebuild and start development container"
	@echo "  make dev-d       - Start development container in background"
	@echo "  make prod        - Start frontend in production mode"
	@echo "  make prod-build  - Rebuild and start production container"
	@echo "  make down        - Stop frontend containers"
	@echo "  make down-v      - Stop and remove volumes"
	@echo "  make logs        - Follow container logs"
	@echo "  make ps          - List running frontend containers"
	@echo "  make sh          - Open interactive shell inside frontend container"
	@echo "  make exec CMD=\"..\" - Execute a command inside the running frontend container"
	@echo "  make run CMD=\"..\"  - Run a one-off command without starting dependencies"

dev:
	docker compose -f docker/compose.yml -f docker/compose.dev.yml up

dev-build:
	docker compose -f docker/compose.yml -f docker/compose.dev.yml up --build

dev-d:
	docker compose -f docker/compose.yml -f docker/compose.dev.yml up -d

prod:
	docker compose -f docker/compose.yml -f docker/compose.prod.yml up -d

prod-build:
	docker compose -f docker/compose.yml -f docker/compose.prod.yml up --build -d

down:
	docker compose -f docker/compose.yml -f docker/compose.dev.yml -f docker/compose.prod.yml down

down-v:
	docker compose -f docker/compose.yml -f docker/compose.dev.yml -f docker/compose.prod.yml down -v

logs:
	docker compose -f docker/compose.yml -f docker/compose.dev.yml logs -f

ps:
	docker compose -f docker/compose.yml ps

# Shell inside running container
sh:
	docker exec -it aib-frontend-main sh

# Execute command inside running container
exec:
	docker exec -it aib-frontend-main $(CMD)

# Run a one-off command in a temporary container without starting dependent service containers
run:
	docker compose -f docker/compose.yml -f docker/compose.dev.yml run --no-deps --rm main-app $(CMD)
