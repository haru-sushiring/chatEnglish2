FROM ubuntu:latest

# マルチステージビルドのためのダミーDockerfile
# render.yamlの各サービスが独自のDockerfileを参照するため、これは使用されません
# しかし、render.comのデプロイプロセスが最初に探すDockerfileとして必要です

CMD ["echo", "このDockerfileは実際には使用されません。"] 