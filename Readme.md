-- Beneficiary Master Table
beneficiaries:
- beneficiary_id (Primary Key)
- aadhaar_number (Encrypted, Unique)
- name, father_name, mother_name
- date_of_birth, gender
- caste_category (SC verification)
- mobile_number, email
- address (state, district, block, village)
- created_date, updated_date
- verification_status, kyc_status

-- Project/Scheme Tracking
projects:
- project_id (Primary Key)
- beneficiary_id (Foreign Key)
- scheme_type (Income Generation/Skill Development/Infrastructure)
- project_name, description
- allocated_amount, disbursed_amount
- start_date, end_date, completion_status
- implementing_agency
- progress_percentage

-- Skill Development Records
skill_training:
- training_id (Primary Key)
- beneficiary_id (Foreign Key)
- course_name, training_provider
- start_date, completion_date
- certification_status, certificate_url
- employment_status_post_training

-- Income Generation Tracking
income_generation:
- initiative_id (Primary Key)
- beneficiary_id (Foreign Key)
- business_type, loan_amount
- monthly_income_before, monthly_income_after
- employment_created
- sustainability_score

-- Verification & Audit Logs
verification_logs:
- log_id (Primary Key)
- beneficiary_id (Foreign Key)
- verification_type (Aadhaar/Mobile/Document)
- verification_date, verified_by
- verification_result, remarks
