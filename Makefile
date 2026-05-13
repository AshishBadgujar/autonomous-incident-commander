.PHONY: install up down logs native-logs smoke demo memory recover

install:
	npm install

up:
	docker compose up -d --remove-orphans
	npm run native:start

down:
	npm run native:stop
	docker compose down

logs:
	docker compose logs -f --tail=120

native-logs:
	npm run native:logs

smoke:
	./scripts/smoke_test.sh

demo:
	./scripts/demo.sh

memory:
	./scripts/show_incident_memory.sh

recover:
	./scripts/recover_demo_api.sh
