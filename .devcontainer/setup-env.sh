#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
    cp .env.example .env
fi

mkdir -p cert

set_env_value() {
    local key="$1"
    local value="$2"

    if grep -q "^${key}=" .env; then
        local escaped
        escaped=$(printf '%s' "$value" | sed 's/[\/&]/\\&/g')
        sed -i "s/^${key}=.*/${key}=${escaped}/" .env
    else
        printf '\n%s=%s\n' "$key" "$value" >> .env
    fi
}

env_value() {
    local key="$1"
    grep "^${key}=" .env | tail -n 1 | cut -d '=' -f 2-
}

if [ -z "$(env_value JWT_PRIVATE_KEY)" ] || [ -z "$(env_value JWT_PUBLIC_KEY)" ]; then
    openssl ecparam -genkey -name prime256v1 -noout -out cert/jwt-pvt.pem
    openssl ec -in cert/jwt-pvt.pem -pubout -out cert/jwt-pub.pem
    set_env_value JWT_PRIVATE_KEY "$(openssl base64 -A -in cert/jwt-pvt.pem)"
    set_env_value JWT_PUBLIC_KEY "$(openssl base64 -A -in cert/jwt-pub.pem)"
fi

yarn install
npx lefthook install
