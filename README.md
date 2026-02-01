# Carbon Seal v2.0 🌍💙

**The National Infrastructure for Blue Carbon Assets.**

Carbon Seal is a production-grade **Digital MRV (dMRV) & Registry Platform** designed to bring sovereign-grade transparency to the Blue Carbon market. By combining satellite-based verification (Sentinel-2 data integration) with blockchain-based tokenization, Carbon Seal eliminates greenwashing and creates high-fidelity digital assets representing verified carbon sequestration.

![Dashboard Preview](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

---

## 🚀 Key Capabilities

### 🛰️ Satellite-First Verification (dMRV)
- **Automated Analysis:** Integration with Sentinel-2 L2A satellite feeds to calculate NDVI (Normalized Difference Vegetation Index) for mangrove and seagrass ecosystems.
- **Geospatial Integrity:** PostGIS-powered boundary validation ensuring no double-counting of protected areas.
- **Dynamic Credit Calculation:** Algorithms that convert biomass density and area into precise Carbon Credit tonnage.

### ⛓️ Enterprise Blockchain Registry
- **Trustless Minting:** Smart contracts (ERC-1155) automatically mint "Blue Carbon Tokens" only after algorithmic verification is passed.
- **Immutable Audit Trail:** Every verification event and status change is hashed and stored on-chain.
- **Custodial Wallets:** Built-in custodial wallet generation for non-crypto-native institutional users, abstracting away private key management.

### 💹 Institutional Marketplace
- **Order Book:** A compliant environment for listing and trading verified assets.
- **Retirement Mechanism:** "Burn" functionality to permanently retire credits and generate impact certificates for offset claims.
- **Portfolio Management:** Real-time dashboards for asset holders to track value, volume, and provenance.

---

## 🛠️ Technology Stack

**Frontend (Enterprise UI)**
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Lucide Icons, Shadcn/UI
- **Design System:** "Glass" aesthetic with Emerald/Slate government-grade palette.

**Backend (Core Logic)**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL with PostGIS extension (via Sequelize ORM).
- **Security:** Helmet, CORS, JWT Authentication, bcrypt encryption.

**Blockchain (Infrastructure)**
- **Network:** Ethereum / Polygon Compatible (Hardhat Development Node).
- **Contracts:** Solidity (OpenZeppelin ERC-1155).
- **Integration:** Ethers.js v6.

**Deployment**
- **Web:** Vercel
- **API:** Render
- **Database:** Render (Managed PostgreSQL)

---

## 📂 Repository Structure

```bash
carbonseal/
├── web-frontend/       # Next.js Enterprise Dashboard & Public Site
├── backend-api/        # Node.js Express Server & dMRV Logic
├── smart-contracts/    # Solidity Contracts & Deployment Scripts
├── mobile-app/         # Companion React Native App (In Development)
└── render.yaml         # Infrastructure-as-Code for Cloud Deployment
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud)
- Git

### 1. Installation
```bash
git clone https://github.com/choudharyms/carbonseal.git
cd carbonseal
```

### 2. Backend Setup
```bash
cd backend-api
npm install
# Configure .env with DATABASE_URL and JWT_SECRET
npm start
```

### 3. Frontend Setup
```bash
cd web-frontend
npm install
# Configure .env.local with NEXT_PUBLIC_API_URL
npm run dev
```

### 4. Smart Contracts (Local Dev)
```bash
cd smart-contracts
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🔮 Roadmap

- [x] **v1.0:** Core Registry & Tokenization
- [x] **v2.0:** Digital MRV & Satellite Integration
- [ ] **v3.0:** AI-powered Biomass Estimation Models
- [ ] **v3.5:** Cross-chain Bridging (Polygon/Celo)

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.

---

**Built with 💙 for the Planet.**