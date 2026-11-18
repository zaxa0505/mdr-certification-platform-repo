CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

email VARCHAR(255) UNIQUE NOT NULL,

password_hash TEXT NOT NULL,

first_name VARCHAR(100),

last_name VARCHAR(100),

role VARCHAR(50) DEFAULT 'user',

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

);

-- =========================================================
-- PROJECTS
-- =========================================================

CREATE TABLE projects (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

user_id UUID NOT NULL,

name VARCHAR(255) NOT NULL,

description TEXT,

device_name VARCHAR(255),

device_type VARCHAR(255),

intended_purpose TEXT,

classification VARCHAR(50),

status VARCHAR(50) DEFAULT 'in_progress',

progress INTEGER DEFAULT 0,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_project_user

    FOREIGN KEY (user_id)

    REFERENCES users(id)

    ON DELETE CASCADE
```

);

-- =========================================================
-- MDR WORKFLOW STEPS
-- =========================================================

CREATE TABLE workflow_steps (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

project_id UUID NOT NULL,

step_number INTEGER NOT NULL,

title VARCHAR(255) NOT NULL,

description TEXT,

status VARCHAR(50) DEFAULT 'pending',

completed_at TIMESTAMP,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_workflow_project

    FOREIGN KEY (project_id)

    REFERENCES projects(id)

    ON DELETE CASCADE
```

);

-- =========================================================
-- CHECKLIST ITEMS
-- =========================================================

CREATE TABLE checklist_items (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

workflow_step_id UUID NOT NULL,

title TEXT NOT NULL,

description TEXT,

completed BOOLEAN DEFAULT FALSE,

completed_at TIMESTAMP,

CONSTRAINT fk_checklist_step

    FOREIGN KEY (workflow_step_id)

    REFERENCES workflow_steps(id)

    ON DELETE CASCADE
```

);

-- =========================================================
-- DOCUMENTS
-- =========================================================

CREATE TABLE documents (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

project_id UUID NOT NULL,

workflow_step_id UUID,

filename VARCHAR(255) NOT NULL,

file_path TEXT NOT NULL,

document_type VARCHAR(100),

uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_document_project

    FOREIGN KEY (project_id)

    REFERENCES projects(id)

    ON DELETE CASCADE,

CONSTRAINT fk_document_step

    FOREIGN KEY (workflow_step_id)

    REFERENCES workflow_steps(id)

    ON DELETE SET NULL
```

);

-- =========================================================
-- REGULATORY SOURCES
-- =========================================================

CREATE TABLE regulatory_sources (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

title TEXT NOT NULL,

source_type VARCHAR(100),

reference TEXT,

url TEXT,

description TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

);

-- =========================================================
-- COMPLIANCE ASSESSMENTS
-- =========================================================

CREATE TABLE compliance_assessments (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

project_id UUID NOT NULL,

workflow_step_id UUID,

assessment TEXT,

result TEXT,

confidence VARCHAR(50),

human_verification_required BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_assessment_project

    FOREIGN KEY (project_id)

    REFERENCES projects(id)

    ON DELETE CASCADE,

CONSTRAINT fk_assessment_step

    FOREIGN KEY (workflow_step_id)

    REFERENCES workflow_steps(id)

    ON DELETE SET NULL
```

);

-- =========================================================
-- AI INTERACTIONS
-- =========================================================

CREATE TABLE ai_interactions (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

project_id UUID,

user_id UUID,

prompt TEXT NOT NULL,

response TEXT,

model VARCHAR(100),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_ai_project

    FOREIGN KEY (project_id)

    REFERENCES projects(id)

    ON DELETE CASCADE,

CONSTRAINT fk_ai_user

    FOREIGN KEY (user_id)

    REFERENCES users(id)

    ON DELETE SET NULL
```

);

-- =========================================================
-- AUDIT LOG
-- =========================================================

CREATE TABLE audit_logs (

```
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

user_id UUID,

project_id UUID,

action VARCHAR(255) NOT NULL,

entity_type VARCHAR(100),

entity_id UUID,

old_value JSONB,

new_value JSONB,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_audit_user

    FOREIGN KEY (user_id)

    REFERENCES users(id)

    ON DELETE SET NULL,

CONSTRAINT fk_audit_project

    FOREIGN KEY (project_id)

    REFERENCES projects(id)

    ON DELETE CASCADE
```

);

-- =========================================================
-- INITIAL REGULATORY SOURCES
-- =========================================================

INSERT INTO regulatory_sources
(title, source_type, reference, url, description)

VALUES

(
'Regulation (EU) 2017/745',
'MDR',
'Regulation (EU) 2017/745',
'https://eur-lex.europa.eu/eli/reg/2017/745/oj',
'European Medical Device Regulation'
),

(
'European Commission Medical Devices',
'European Commission',
'Medical Devices Sector',
'https://health.ec.europa.eu/medical-devices-sector_en',
'Official European Commission medical device regulatory information'
),

(
'MDCG Guidance Documents',
'MDCG',
'MDCG Guidance',
'https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en',
'Medical Device Coordination Group guidance documents'
),

(
'EUDAMED',
'European Commission',
'European Database on Medical Devices',
'https://health.ec.europa.eu/medical-devices-eudamed_en',
'European database on medical devices'
);
