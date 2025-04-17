FROM nginx:latest

# タイムゾーン設定
ENV TZ=Asia/Tokyo

# Nginxの設定をコピー
COPY ./docker/web/default.conf /etc/nginx/conf.d/default.conf

# ヘルスチェック設定
HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD curl -f http://localhost:8000/ || exit 1

# ポート設定
EXPOSE 8000

# コンテナ起動コマンド
CMD ["nginx", "-g", "daemon off;"] 