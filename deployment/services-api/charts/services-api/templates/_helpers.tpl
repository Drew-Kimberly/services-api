{{/*
Expand the name of the chart.
*/}}
{{- define "services-api.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "services-api.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels for metadata.
*/}}
{{- define "services-api.standard-labels" -}}
app.kubernetes.io/name: {{ include "services-api.name" . | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
app.kubernetes.io/release: {{ .Release.Name | quote }}
helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}"
{{- end -}}

{{/*
A set of common selector labels for resources.
*/}}
{{- define "services-api.standard-selector-labels" -}}
app.kubernetes.io/name: {{ include "services-api.name" . | quote }}
app.kubernetes.io/release: {{ .Release.Name | quote }}
{{- end -}}
