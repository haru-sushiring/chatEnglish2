FROM php:8.2-fpm

WORKDIR /var/www/html/app

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    supervisor

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composer install
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy Laravel app only
COPY ./app /var/www/html/app

# Config files
COPY ./docker/web/render_default.conf /etc/nginx/conf.d/default.conf
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permissions
RUN mkdir -p storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

RUN composer install --no-interaction --no-dev --optimize-autoloader

# App key will be set via env at runtime, not during build
EXPOSE 8000

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
