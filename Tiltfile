# This file is written in Starlark.
# For language features check out https://github.com/google/starlark-go/blob/master/doc/spec.md
# For Tilt-specific features check out https://docs.tilt.dev/api.html

load('ext://min_tilt_version', 'min_tilt_version')

min_tilt_version('0.22')

# --- START: services-api ---
k8s_yaml(helm(
    'deployment/services-api/charts/services-api',
    values=['deployment/services-api/charts/services-api.local.values.yaml']
))

docker_build(
    ref='services-api',
    context='.',
    dockerfile='Dockerfile',
    target='dev',
    live_update=[
        sync('src', '/app/src')
    ]
)

k8s_resource('services-api', port_forwards=3100)
