FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends libgtk-3-0t64 libwebkit2gtk-4.1-0 libglu1-mesa libsoup-3.0-0 libsecret-1-0 libgl1 libegl1 libgstreamer1.0-0 libgstreamer-plugins-base1.0-0 xvfb xauth locales ca-certificates libosmesa6 && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y --no-install-recommends libmspack0t64 && rm -rf /var/lib/apt/lists/*
