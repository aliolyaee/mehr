########### Stage 1: Build ############
FROM node:20-alpine AS builder

# سرعت نصب → اضافه‌کردن libcairo‑dependencies اگر از sharp‌ استفاده می‌کنید
RUN apk add --no-cache git

WORKDIR /app

# کپی فقط فایل‌های وابستگی برای کش بهتر
COPY frontend/package*.json ./
# اگر از pnpm:
# RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm ci --omit=dev      # فقط deps production (اگر نیاز دارید dev deps هم لازم است vite در dev)
COPY frontend/ ./

# خروجی Vite
RUN npm run build

########### Stage 2: Runtime (Nginx) ###########
FROM nginx:1.27-alpine

# حذف کانفیگ default
RUN rm /etc/nginx/conf.d/default.conf

# کانفیگ سفارشی – cache + gzip + SPA fallback
COPY docker/react/nginx.conf /etc/nginx/conf.d/react.conf

# فایل‌های استاتیک
COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1
