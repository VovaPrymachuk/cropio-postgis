# Use the official Ruby image
ARG RUBY_VERSION=3.2.2
FROM ruby:$RUBY_VERSION-slim

# Set the working directory for the Rails app
WORKDIR /cropio-postgis

# Set production environment variables
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# Install packages needed for deployment, including PostGIS and PostgreSQL
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libvips libproj-dev proj-bin libpq-dev build-essential postgresql postgresql-contrib postgis libgeos-dev && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Remove unnecessary files to reduce the image size
RUN bundle clean --force

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Run and own only the runtime files as a non-root user for security
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp

USER rails:rails

# Entrypoint prepares the database
ENTRYPOINT ["/cropio-postgis/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD ["./bin/rails", "server"]
