# DDNS Node

DDNS Node is a dynamic DNS service built with Node.js. It allows you to update DNS records automatically when your IP address changes.

# Deploy on Kubernetes on Ruspberry Pi 5

You can deploy DDNS Node on Kubernetes using the following steps:

1. Clone the repository:

```bash
git clone
```

2. Change the working directory:

```bash
cd simplest-ddns-client-node
```

3. Create a kubernetes secret with your Porkbun API key:

```bash
kubectl create secret generic ddns-secret \
    --from-literal=PORKBUN_API_KEY=<your-porkbun-api-key> \
    --from-literal=PORKBUN_SECRET_KEY=<your-porkbun-secret-key>

```

4. Change the `ddns-node.yaml` file to match your domain and subdomain

5. Set the INITIAL_IP environment variable to your current IP address

6. Deploy the DDNS Node service:

```bash
kubectl apply -f ddns-node.yaml
```

7. Check the logs to see if the service is running:

```bash
kubectl logs -f ddns-node
```


