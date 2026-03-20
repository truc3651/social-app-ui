# ==============================================================================
# SocialApp — WireMock Mock Server
# Supports: macOS (Apple Silicon + Intel) and Windows (Git Bash / MSYS2)
# ==============================================================================

WIREMOCK_IMAGE   = wiremock/wiremock:3.13.0
CONTAINER_NAME   = socialapp-wiremock
HOST_PORT        = 8080
WIREMOCK_PORT    = 8080

# --- Platform detection -------------------------------------------------------

OS_RAW    := $(shell uname -s)
ARCH_RAW  := $(shell uname -m)

ifeq ($(findstring Darwin,$(OS_RAW)),Darwin)
  DETECTED_OS   = macos
else ifeq ($(findstring MINGW,$(OS_RAW)),MINGW)
  DETECTED_OS   = windows
else ifeq ($(findstring MSYS,$(OS_RAW)),MSYS)
  DETECTED_OS   = windows
else ifeq ($(findstring NT,$(OS_RAW)),NT)
  DETECTED_OS   = windows
else
  DETECTED_OS   = linux
endif

ifeq ($(ARCH_RAW),arm64)
  DETECTED_ARCH = arm64
else ifeq ($(ARCH_RAW),aarch64)
  DETECTED_ARCH = arm64
else
  DETECTED_ARCH = amd64
endif

# --- Docker Desktop download URLs --------------------------------------------

DOCKER_URL_MACOS_ARM64  = https://desktop.docker.com/mac/main/arm64/Docker.dmg
DOCKER_URL_MACOS_AMD64  = https://desktop.docker.com/mac/main/amd64/Docker.dmg
DOCKER_URL_WINDOWS      = https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe

# --- Volume paths (Windows Git Bash needs POSIX → Windows path conversion) ----

ifeq ($(DETECTED_OS),windows)
  MAPPINGS_DIR = $(shell cygpath -w "$(CURDIR)/wiremock/mappings" 2>/dev/null || echo "$(CURDIR)/wiremock/mappings")
  FILES_DIR    = $(shell cygpath -w "$(CURDIR)/wiremock/__files" 2>/dev/null || echo "$(CURDIR)/wiremock/__files")
  # Git Bash: disable automatic POSIX-to-Windows path mangling for docker CLI
  export MSYS_NO_PATHCONV=1
else
  MAPPINGS_DIR = $(CURDIR)/wiremock/mappings
  FILES_DIR    = $(CURDIR)/wiremock/__files
endif

# --- Phony targets ------------------------------------------------------------

.PHONY: mock mock-stop mock-restart mock-logs mock-status mock-clean \
        dev help docker-check docker-install docker-ensure

# ==============================================================================
# Docker prerequisite targets
# ==============================================================================

docker-check: ## Check Docker installation and daemon status
	@echo "Platform: $(DETECTED_OS)/$(DETECTED_ARCH)"
	@echo ""
	@if command -v docker >/dev/null 2>&1; then \
		echo "Docker CLI:    installed ($(shell docker --version 2>/dev/null || echo 'unknown'))"; \
	else \
		echo "Docker CLI:    NOT installed"; \
	fi
	@if docker info >/dev/null 2>&1; then \
		echo "Docker daemon: running"; \
	else \
		echo "Docker daemon: NOT running"; \
	fi

docker-install: ## Download and install Docker Desktop for your platform
	@if command -v docker >/dev/null 2>&1; then \
		echo "Docker is already installed: $$(docker --version)"; \
		exit 0; \
	fi; \
	echo ""; \
	echo "Docker not found. Installing Docker Desktop..."; \
	echo "Platform: $(DETECTED_OS)/$(DETECTED_ARCH)"; \
	echo ""; \
	if [ "$(DETECTED_OS)" = "macos" ]; then \
		DOWNLOAD_URL=""; \
		if [ "$(DETECTED_ARCH)" = "arm64" ]; then \
			DOWNLOAD_URL="$(DOCKER_URL_MACOS_ARM64)"; \
		else \
			DOWNLOAD_URL="$(DOCKER_URL_MACOS_AMD64)"; \
		fi; \
		echo "Downloading Docker Desktop for macOS ($(DETECTED_ARCH))..."; \
		curl -fSL -o /tmp/Docker.dmg "$$DOWNLOAD_URL"; \
		echo "Mounting disk image..."; \
		hdiutil attach /tmp/Docker.dmg -nobrowse -quiet; \
		echo "Copying Docker.app to /Applications..."; \
		cp -R "/Volumes/Docker/Docker.app" /Applications/; \
		echo "Unmounting disk image..."; \
		hdiutil detach "/Volumes/Docker" -quiet; \
		rm -f /tmp/Docker.dmg; \
		echo ""; \
		echo "Docker Desktop installed to /Applications/Docker.app"; \
		echo "Opening Docker Desktop (first launch may take a minute)..."; \
		open /Applications/Docker.app; \
		echo ""; \
		echo "Waiting for Docker daemon to become ready..."; \
		TRIES=0; \
		while ! docker info >/dev/null 2>&1; do \
			TRIES=$$((TRIES + 1)); \
			if [ $$TRIES -ge 60 ]; then \
				echo ""; \
				echo "ERROR: Docker daemon did not start within 60 seconds."; \
				echo "Please open Docker Desktop manually and wait for it to finish starting."; \
				exit 1; \
			fi; \
			printf "."; \
			sleep 2; \
		done; \
		echo ""; \
		echo "Docker is ready: $$(docker --version)"; \
	elif [ "$(DETECTED_OS)" = "windows" ]; then \
		echo "Downloading Docker Desktop for Windows..."; \
		curl -fSL -o /tmp/DockerDesktopInstaller.exe "$(DOCKER_URL_WINDOWS)"; \
		echo ""; \
		echo "Running installer (this may trigger a UAC prompt)..."; \
		echo "The installer will run silently. Your terminal will wait until it finishes."; \
		echo ""; \
		cmd //c "$(shell cygpath -w /tmp/DockerDesktopInstaller.exe 2>/dev/null || echo /tmp/DockerDesktopInstaller.exe)" install --quiet --accept-license; \
		rm -f /tmp/DockerDesktopInstaller.exe; \
		echo ""; \
		echo "Docker Desktop installed."; \
		echo "IMPORTANT: You may need to:"; \
		echo "  1. Log out and log back in (or restart) for group membership to apply."; \
		echo "  2. Open Docker Desktop from the Start Menu for the first time."; \
		echo "  3. Re-open this terminal so 'docker' is available in your PATH."; \
	else \
		echo "ERROR: Automatic install is not supported for $(DETECTED_OS)."; \
		echo "Please install Docker manually: https://docs.docker.com/get-docker/"; \
		exit 1; \
	fi

docker-ensure: ## Install Docker if missing, then ensure the daemon is running
	@if ! command -v docker >/dev/null 2>&1; then \
		$(MAKE) docker-install; \
	fi; \
	if docker info >/dev/null 2>&1; then \
		exit 0; \
	fi; \
	echo "Docker daemon is not running. Starting Docker Desktop..."; \
	if [ "$(DETECTED_OS)" = "macos" ]; then \
		open /Applications/Docker.app; \
	elif [ "$(DETECTED_OS)" = "windows" ]; then \
		cmd //c "start" "Docker Desktop" 2>/dev/null || \
		"/c/Program Files/Docker/Docker/Docker Desktop.exe" 2>/dev/null & \
		true; \
	fi; \
	echo "Waiting for Docker daemon to become ready..."; \
	TRIES=0; \
	while ! docker info >/dev/null 2>&1; do \
		TRIES=$$((TRIES + 1)); \
		if [ $$TRIES -ge 60 ]; then \
			echo ""; \
			echo "ERROR: Docker daemon did not start within 60 seconds."; \
			echo "Please start Docker Desktop manually and try again."; \
			exit 1; \
		fi; \
		printf "."; \
		sleep 2; \
	done; \
	echo ""; \
	echo "Docker daemon is ready."

# ==============================================================================
# WireMock targets
# ==============================================================================

mock: docker-ensure ## Start WireMock mock server on port $(HOST_PORT)
	@docker run -d --rm \
		--name $(CONTAINER_NAME) \
		-p $(HOST_PORT):$(WIREMOCK_PORT) \
		-v "$(MAPPINGS_DIR):/home/wiremock/mappings" \
		-v "$(FILES_DIR):/home/wiremock/__files" \
		$(WIREMOCK_IMAGE) \
		--verbose --global-response-templating --enable-stub-cors
	@echo ""
	@echo "WireMock is running at http://localhost:$(HOST_PORT)"
	@echo "Admin dashboard:     http://localhost:$(HOST_PORT)/__admin"
	@echo ""
	@echo "Stop with:  make mock-stop"

mock-stop: ## Stop WireMock container
	@docker stop $(CONTAINER_NAME) 2>/dev/null || echo "Container not running"

mock-restart: mock-stop mock ## Restart WireMock (picks up mapping changes)

mock-logs: ## Tail WireMock container logs
	@docker logs -f $(CONTAINER_NAME)

mock-status: ## Show loaded stub mappings count
	@curl -s http://localhost:$(HOST_PORT)/__admin/mappings | \
		python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d['meta']['total']} stub mappings loaded\")" \
		2>/dev/null || echo "WireMock is not running"

mock-clean: mock-stop ## Stop WireMock and remove the Docker image
	@docker rmi $(WIREMOCK_IMAGE) 2>/dev/null || true

# ==============================================================================
# Dev convenience
# ==============================================================================

dev: mock ## Start WireMock + Vite dev server
	@npm run dev

help: ## Show this help
	@grep -E '^[a-z_-]+:.*## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
