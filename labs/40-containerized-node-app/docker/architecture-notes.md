## Step 2 : Map the current architecture

### Architecture diagram

```js
graph TB
    subgraph Internet
        User[👤 User/Browser]
    end

    subgraph K8s["☸️ Kubernetes Cluster"]
        Service[🔀 Service<br/>Load Balancer]

        subgraph Deployment["📦 Deployment"]
            Pod1[🟢 Pod 1<br/>Container: App]
            Pod2[🟢 Pod 2<br/>Container: App]
        end

        DB[(🐘 PostgreSQL<br/>Database)]
    end

    User -->|HTTP Request| Service
    Service -->|Route Traffic| Pod1
    Service -->|Route Traffic| Pod2
    Pod1 -.->|SQL Query| DB
    Pod2 -.->|SQL Query| DB

    style User fill:#3498db,stroke:#2980b9,color:#fff
    style Service fill:#e74c3c,stroke:#c0392b,color:#fff
    style Deployment fill:#f39c12,stroke:#d68910,color:#fff
    style Pod1 fill:#2ecc71,stroke:#27ae60,color:#fff
    style Pod2 fill:#2ecc71,stroke:#27ae60,color:#fff
    style DB fill:#9b59b6,stroke:#8e44ad,color:#fff
    style K8s fill:#ecf0f1,stroke:#34495e,stroke-width:3px

```

### Questions

#### Where does isolation happen?

L'isolation se produit au niveau des Pods.

#### What restarts automatically?

Kubernetes redémarre automatiquement :

- Les Pods
- Les Containers

#### What does Kubernetes not manage?

Kubernetes ne gère PAS :

- La base de données PostgreSQL
- Le code de l'application
- Les données persistantes par défaut
- Le contenu statique ou fichiers uploadés
- La configuration applicative

## Step 3 : Compare containers and virtual machines

### Comparison table

| CritèreVirtual         |                                  Machines (VMs)                                  |                                                                       Containers |
| :--------------------- | :------------------------------------------------------------------------------: | -------------------------------------------------------------------------------: |
| Kernel Sharing         |      Chaque VM a son propre kernel (OS complet). Pas de partage entre VMs.       |                       Tous les containers partagent le même kernel de l'OS hôte. |
| Startup Time           |                   Lent (minutes) - doit démarrer un OS complet                   |                   Très rapide (secondes) - démarre juste le processus applicatif |
| Resource Overhead      |      Lourd - chaque VM nécessite RAM, CPU pour un OS complet (plusieurs GB)      | Léger - partage les ressources, seulement l'app et ses dépendances (quelques MB) |
| Security Isolation     |   Isolation forte - hyperviseur sépare complètement les VMs au niveau matériel   |              Isolation moyenne - partage du kernel peut créer des vulnérabilités |
| Operational Complexity |          Plus complexe - gestion de multiples OS, patches, mises à jour          |                    Plus simple - un seul OS à maintenir, déploiement standardisé |
| Portabilité            | Moins portable - dépend de l'hyperviseur et du format (VMware, VirtualBox, etc.) |                           Très portable - "build once, run anywhere" avec Docker |
| Taille                 |                       Très volumineuse (10-100+ GB par VM)                       |                                                   Petite (10-500 MB typiquement) |

### Questions

#### When would you prefer a VM over a container?

Il est préférer de prendre une VM si il y a un besoin d'OS différent, ou un environnement materiel particulier

#### When would you combine both?

## Step 4 : Introduce horizontal scaling

### Questions

#### What changes when you scale?

Le LoadBalancer ne redirige pas vers le même pod à chaque fois. Chaque pod dispose d'un port différent.

#### What does not change?

Les pods doivent fonctionner de la même manière. Le point d'entrée reste le service.

## Step 5 : Simulate failure

### Questions

#### Who recreated the pod?

C'est le Deployment

#### Why?

Parce que le Deployment a pour mission de garantir la haute disponibilité et la résilience de l'application.

#### What would happen if the node itself failed?

- Détection de la panne
- Éviction des pods
- Recréation automatique
- Mise à jour du Service

## Step 6 : Introduce resource limits

### Questions

#### What are requests vs limits?

Les limites correspondent aux ressources maximales allouées, tandis que les demandes correspondent aux allocations de ressources demandées par le pod.

#### Why are they important in multi-tenant systems?

Elles sont importantes pour s'assurer que les pods ne consomment pas trop de ressources et ne provoquent pas de plantage du système.

## Step 7 : Add readiness and liveness probes

#### What is the difference between readiness and liveness?

La disponibilité est la vérification effectuée au démarrage du pod pour savoir s'il est prêt.
La vitalité est une vérification effectuée toutes les x secondes lorsque le pod est prêt afin de savoir s'il fonctionne toujours.

#### Why does this matter in production?

Il est important de savoir si l'application fonctionne correctement, même si elle n'a pas planté.

## Connect Kubernetes to virtualization

#### What runs underneath your k3s cluster?

Machines virtuelles

#### Is Kubernetes replacing virtualization?

Non, c'est une utilisation différente

#### In a cloud provider, what actually hosts your nodes?

/

## Step 8 : Design a production architecture

#### What would run in Kubernetes?

Nodes, Database, Monitoring, Logging

#### What would run in VMs?

Nodes

#### What would run outside the cluster?

Backups, CI/CD

## Step 9 : Required break and analysis

#### Why is this better than plain-text configuration?

Parce que c'est secret : pour ne pas exposer les clés API.

#### Is a Secret encrypted by default? Where?

Non c'est encodé en base64
