FROM php:8.2-fpm

WORKDIR /var/www/html/app

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    nginx \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . /var/www/html

# Copy nginx and supervisord config
COPY ./docker/web/railway_default.conf /etc/nginx/conf.d/default.conf
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /var/www/html/app
RUN cp .env.example .env

# Set permissions
RUN mkdir -p storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Install dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader
RUN npm install && npm run build

# Generate app key
RUN php artisan key:generate

EXPOSE 8000

CMD ["/usr/bin/supervisord"]
