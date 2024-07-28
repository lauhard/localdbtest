#!/bin/bash

ensure_root() {
    if [[ "$(id -u)" -ne 0 ]]; then
        echo "This script must be run as root or with sudo."
        echo "Relaunching with sudo..."
        sudo "$0" "$@"
        exit $?
    fi
}

# Variables
POCKETBASE_VERSION="0.22.16"
DOWNLOAD_URL="https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip"
DOWNLOAD_DIR="$HOME/pocketbase"
ZIP_FILE="$DOWNLOAD_DIR/pocketbase_${POCKETBASE_VERSION}.zip"
EXTRACT_DIR="$DOWNLOAD_DIR/pocketbase_${POCKETBASE_VERSION}"
EXECUTABLE_PATH="${EXTRACT_DIR}/pocketbase"

SYMLINK_PATH="/usr/local/bin/pocketbase"

SERVICE_NAME="pocketbase"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
USER="$(whoami)" # Replace with specific username if necessary

# Function to create the systemd service file
create_service_file() {
    echo "
[Unit]
Description=PocketBase Service
After=network.target

[Service]
User=${USER}
WorkingDirectory=${EXTRACT_DIR}
ExecStart=${EXECUTABLE_PATH} serve

[Install]
WantedBy=multi-user.target
" | sudo tee "${SERVICE_FILE}" >/dev/null
}

# Function to enable and start the service
enable_start_service() {
    sudo systemctl enable "${SERVICE_NAME}" || {
        log_error "Failed to enable ${SERVICE_NAME} service"
        exit 1
    }
    sudo systemctl start "${SERVICE_NAME}" || {
        log_error "Failed to start ${SERVICE_NAME} service"
        exit 1
    }
    sudo systemctl status "${SERVICE_NAME}" || {
        log_error "${SERVICE_NAME} service is not running"
        exit 1
    }
}

# Ensure the script is running with root privileges
ensure_root "$@"

# Ensure the extracted pocketbase binary exists
if [[ ! -f "$EXTRACT_DIR/pocketbase" ]]; then
    # Create download directory
    mkdir -p "$DOWNLOAD_DIR"

    # Download PocketBase
    echo "Downloading PocketBase v${POCKETBASE_VERSION}..."
    curl -L "$DOWNLOAD_URL" -o "$ZIP_FILE"

    # Extract the archive
    echo "Extracting PocketBase..."
    unzip -o "$ZIP_FILE" -d "$EXTRACT_DIR"

    # Make the pocketbase executable available in PATH
    chmod +x "$DOWNLOAD_DIR/pocketbase"
    sudo ln -s "$DOWNLOAD_DIR/pocketbase" $SYMLINK_PATH # Assuming you want it in system path

    # Clean up the zip file
    rm "$ZIP_FILE"

    # Provide feedback
    echo "PocketBase v${POCKETBASE_VERSION} has been downloaded and extracted to $EXTRACT_DIR"
    read

    # Ensure the extracted pocketbase binary exists
    if [[ ! -f "$EXECUTABLE_PATH" ]]; then
        echo "Error: PocketBase binary not found at $EXTRACT_DIR/pocketbase.\n Press any key to exit."
        read
        exit 1
    fi

else
    echo "PocketBase is already installed."
    read
fi

# Ensure /usr/local/bin exists
if [[ ! -d "/usr/local/bin" ]]; then
    echo "Creating /usr/local/bin directory... Press any key to continue."
    read
    mkdir -p /usr/local/bin
fi

# Create a symbolic link
echo "Creating symbolic link to /usr/local/bin..."
ln -sf "$EXECUTABLE_PATH" "$SYMLINK_PATH"

# Verify the symbolic link
if [[ -L "$SYMLINK_PATH" ]]; then
    echo "The symbolic link has been verified at $SYMLINK_PATH"

    # Attempt to create service file
    echo "Creating systemd service file..."
    if ! create_service_file; then
        log_error "Failed to create systemd service file ${SERVICE_FILE}. \n Press any key to exit."
        read
        exit 1
    fi

    # Attempt to enable and start the service
    echo "Enabling and starting PocketBase service..."
    if ! enable_start_service; then
        log_error "Failed to enable and start PocketBase service. \n Press any key to exit."
        read
        exit 1
    fi

    echo "PocketBase systemd service setup successfully. \n Press any key to start PocketBase..."
    read

    echo "You can start PocketBase by running: pocketbase serve"
    pocketbase serve

else
    echo "Symbolic link creation failed. Please check for errors.\n Press any key to exit."
    read
    exit 1
fi
read

# End of script
