# Use the official Node.js 23 image from Amazon ECR Public Gallery
FROM public.ecr.aws/docker/library/node:23

WORKDIR /app

# IMPORTANT: replace the URL below with the https URL to YOUR public GitHub repo.
# The container clones your repo and then runs `node src/index.js`.
RUN git clone https://github.com/sshh323/assignment1.git .

ENTRYPOINT ["node", "src/index.js"]
