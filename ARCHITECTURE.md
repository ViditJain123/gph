# GPH - Deepfake Detection System Architecture

## System Overview

This is a comprehensive Next.js-based deepfake detection system that leverages Large Language Model (LLM) technology for advanced media analysis. The system provides enterprise-grade deepfake detection capabilities with detailed forensic reporting.

## Detailed Architecture Flow Diagram

```mermaid
graph TB
    %% Client Layer
    subgraph "Client Layer (Browser Environment)"
        A[User Browser] --> B[Next.js Frontend SPA]
        B --> C[React Components]
        
        subgraph "UI Components"
            C --> D[UploadComponent.tsx]
            C --> E[ResultsDisplay.tsx]
            C --> F[Home Page.tsx]
        end
        
        subgraph "State Management"
            D --> G[useState - File State]
            D --> H[useState - Analysis State]
            D --> I[useState - Error State]
            E --> J[Report State Management]
        end
    end

    %% Network Layer
    subgraph "Network Communication Layer"
        K[HTTP/HTTPS Protocol]
        L[FormData Multipart Upload]
        M[JSON Response Handling]
        N[Error Handling & Retry Logic]
    end

    %% Server Layer
    subgraph "Next.js Server Layer (Node.js Runtime)"
        O[Next.js App Router]
        O --> P[API Route Handlers]
        
        subgraph "API Endpoints"
            P --> Q[/api/detect-deepfake/route.ts]
            P --> R[/api/generate-pdf/route.ts]
        end
        
        subgraph "Middleware & Validation"
            Q --> S[File Type Validation]
            Q --> T[File Size Validation - 50MB]
            Q --> U[Security Headers]
            Q --> V[CORS Configuration]
        end
    end

    %% Processing Layer
    subgraph "Media Processing & Analysis Layer"
        W[File Buffer Processing]
        X[MD5 Hash Generation]
        Y[Base64 Encoding]
        Z[MIME Type Detection]
        
        subgraph "File Format Support"
            AA[Video Support: MP4, AVI, MOV, WebM]
            AB[Image Support: JPEG, PNG, WebP]
        end
    end

    %% LLM Integration Layer
    subgraph "LLM Integration Layer"
        AC[Google GenAI Client]
        AD[LLM API Configuration]
        AE[API Key Management]
        AF[Request Rate Limiting]
        
        subgraph "LLM Processing Engine"
            AG[LLM 2.5 Pro Model]
            AH[Vision Analysis Module]
            AI[Structured Output Schema]
            AJ[JSON Response Validation]
        end
    end

    %% Analysis Engine
    subgraph "Deepfake Analysis Engine"
        AK[Frame-by-Frame Analysis]
        AL[Facial Landmark Detection - 68-point]
        AM[Temporal Consistency Analysis]
        AN[Audio-Visual Sync Analysis]
        AO[Compression Artifact Detection]
        AP[Lighting Inconsistency Detection]
        AQ[Texture Analysis]
        AR[Edge Detection Algorithms]
        
        subgraph "Advanced Detection Modules"
            AS[Lip-Sync Correlation Engine]
            AT[Facial Expression Consistency]
            AU[Shadow & Reflection Analysis]
            AV[Pixel-Level Manipulation Detection]
            AW[Frequency Domain Analysis]
            AX[Neural Pattern Recognition]
        end
    end

    %% Report Generation
    subgraph "Report Generation & Documentation"
        AY[Analysis Report Builder]
        AZ[Confidence Score Calculator]
        BA[Statistical Aggregation]
        BB[Forensic Metadata Extractor]
        
        subgraph "Report Components"
            BC[Case Overview Generator]
            BD[Frame Classification Matrix]
            BE[Temporal Analysis Results]
            BF[Audio-Visual Sync Results]
            BG[Technical Parameter Documentation]
        end
    end

    %% PDF Generation
    subgraph "PDF Generation Service"
        BH[jsPDF Engine]
        BI[Report Template System]
        BJ[Data Visualization Components]
        BK[Chart Generation]
        BL[Table Formatting]
        BM[Multi-page Layout Management]
        BN[Header/Footer Generation]
    end

    %% Data Types & Schemas
    subgraph "Type System & Data Validation"
        BO[TypeScript Interfaces]
        BP[DeepfakeAnalysisReport Schema]
        BQ[LLM Response Schema]
        BR[Validation Rules]
        BS[Error Type Definitions]
    end

    %% Security Layer
    subgraph "Security & Compliance Layer"
        BT[Input Sanitization]
        BU[File Type Whitelisting]
        BV[Size Limit Enforcement]
        BW[API Rate Limiting]
        BX[Error Message Sanitization]
        BY[Secure Headers Implementation]
        BZ[Data Privacy Compliance]
    end

    %% Infrastructure Layer
    subgraph "Infrastructure & Deployment"
        CA[Next.js Production Build]
        CB[Turbopack Build System]
        CC[Static Asset Optimization]
        CD[Environment Variable Management]
        CE[Health Check Endpoints]
        CF[Monitoring & Logging]
    end

    %% External Dependencies
    subgraph "External Dependencies & Services"
        CG[Google GenAI API]
        CH[Node.js File System]
        CI[Crypto Module for Hashing]
        CJ[Multer for File Handling]
        CK[React State Management]
    end

    %% Data Flow Connections
    A --> K
    K --> O
    D --> L
    L --> Q
    Q --> S
    S --> W
    W --> AC
    AC --> AG
    AG --> AK
    AK --> AY
    AY --> E
    E --> R
    R --> BH
    BH --> A

    %% Advanced Analysis Flow
    AH --> AL
    AL --> AM
    AM --> AN
    AK --> AS
    AS --> AT
    AT --> AU
    AU --> AV

    %% Security Flow
    Q --> BT
    BT --> BU
    BU --> BV

    %% Report Flow
    AY --> BC
    BC --> BD
    BD --> BE
    BE --> BF

    %% Infrastructure Flow
    O --> CA
    CA --> CB
    CB --> CF

    %% Data Validation Flow
    AG --> BO
    BO --> BP
    BP --> BQ

    %% Styling
    classDef clientLayer fill:#e1f5fe
    classDef serverLayer fill:#f3e5f5
    classDef processingLayer fill:#e8f5e8
    classDef llmLayer fill:#fff3e0
    classDef analysisLayer fill:#fce4ec
    classDef reportLayer fill:#f1f8e9
    classDef securityLayer fill:#ffebee
    classDef infraLayer fill:#e0f2f1

    class A,B,C,D,E,F,G,H,I,J clientLayer
    class O,P,Q,R,S,T,U,V serverLayer
    class W,X,Y,Z,AA,AB processingLayer
    class AC,AD,AE,AF,AG,AH,AI,AJ llmLayer
    class AK,AL,AM,AN,AO,AP,AQ,AR,AS,AT,AU,AV,AW,AX analysisLayer
    class AY,AZ,BA,BB,BC,BD,BE,BF,BG,BH,BI,BJ,BK,BL,BM,BN reportLayer
    class BT,BU,BV,BW,BX,BY,BZ securityLayer
    class CA,CB,CC,CD,CE,CF infraLayer
```

## Component Architecture Details

### 1. Frontend Architecture (Client-Side)

#### Component Hierarchy
```
├── app/
│   ├── page.tsx (Main Controller)
│   ├── layout.tsx (App Shell)
│   └── globals.css (Styling)
├── components/
│   ├── UploadComponent.tsx (File Upload Handler)
│   └── ResultsDisplay.tsx (Report Visualization)
```

#### State Management Flow
```typescript
// State Flow Pattern
User Interaction → Component State → API Call → Response State → UI Update
```

### 2. API Layer Architecture

#### Request Processing Pipeline
```
File Upload → Validation → Buffer Processing → LLM Integration → Response
```

#### Error Handling Chain
```
Client Validation → Server Validation → Processing Errors → LLM Errors → User Feedback
```

### 3. LLM Integration Architecture

#### Analysis Pipeline
```
Media Input → Base64 Encoding → LLM Vision Model → Structured Analysis → Report Generation
```

#### Prompt Engineering System
```
Dynamic Prompt → Context Injection → Schema Validation → Response Processing
```

### 4. Analysis Engine Architecture

#### Multi-Modal Detection System
```
Visual Analysis ← Frame Extraction ← Video Processing
Audio Analysis ← Audio Extraction ← Sync Validation
Temporal Analysis ← Sequence Processing ← Consistency Check
```

#### Confidence Scoring Algorithm
```
Frame Confidence → Aggregation → Weighted Average → Final Score
```

### 5. Report Generation Architecture

#### Document Structure
```
Metadata → Analysis Results → Visualizations → Forensic Details → PDF Export
```

## Security Architecture

### 1. Input Validation Layer
- File type whitelisting (Video: MP4, AVI, MOV, WebM | Image: JPEG, PNG, WebP)
- Size validation (50MB maximum)
- MIME type verification
- Content-based validation

### 2. Processing Security
- Buffer overflow protection
- Memory limit enforcement
- Timeout handling
- Error sanitization

### 3. API Security
- Rate limiting implementation
- CORS configuration
- Secure headers
- Environment variable protection

## Performance Optimization

### 1. Client-Side Optimizations
- React component memoization
- Lazy loading for large reports
- Progressive file upload
- Optimistic UI updates

### 2. Server-Side Optimizations
- Turbopack build system
- API response caching
- Memory-efficient file processing
- Stream processing for large files

### 3. LLM Integration Optimizations
- Connection pooling
- Request batching
- Response streaming
- Error recovery mechanisms

## Data Flow Architecture

### 1. Upload Flow
```
File Selection → Validation → FormData Creation → API Request → Processing → Analysis
```

### 2. Analysis Flow
```
LLM Processing → Frame Analysis → Temporal Analysis → Confidence Calculation → Report Generation
```

### 3. Report Flow
```
Analysis Results → Data Aggregation → Template Application → PDF Generation → Download
```

## Technology Stack Integration

### Frontend Stack
- **Next.js 15.5.3**: React framework with App Router
- **React 19.1.0**: UI library with hooks
- **TypeScript 5**: Type safety and development experience
- **Tailwind CSS 4**: Utility-first styling

### Backend Stack
- **Node.js**: Runtime environment
- **Next.js API Routes**: Serverless functions
- **Google GenAI**: LLM integration
- **Multer**: File upload handling

### Analysis Stack
- **LLM 2.5 Pro**: Vision and text analysis
- **Crypto Module**: Hash generation
- **jsPDF**: PDF generation
- **html2canvas**: Screenshot capabilities

## Deployment Architecture

### Build System
```
Source Code → TypeScript Compilation → Turbopack Bundling → Static Generation → Deployment
```

### Environment Configuration
```
Development → Staging → Production
Local LLM → Test LLM → Production LLM
```

This architecture provides a comprehensive, enterprise-grade deepfake detection system with advanced LLM integration, robust security measures, and detailed forensic reporting capabilities.