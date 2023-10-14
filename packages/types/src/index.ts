
export type Point = {x: number, y: number};

//https://cloud.google.com/document-ai/docs/reference/rest/v1/Document#pageanchor
export interface PageAnchor {
  page: string | number | Long,
  boundingPoly: Point[],
}

export interface DocumentFieldValue {
  value: string | null;
  confidence: number;
  pageAnchor?: PageAnchor[]
}


export type DocumentData = {
  [key: string]: DocumentEntityData;
};

export type DocumentEntityData = {
  [key: string]: DocumentFieldValue;
};

export interface Document{
  name: string,
  base64: string | ArrayBuffer;
}

export interface Page {
  pageNumber: number,
  image: {
    /** Image content */
    content: (Uint8Array|string);

    /** Image mimeType */
    mimeType?: (string);

    /** Image width */
    width: number;

    /** Image height */
    height: number;
  },
}

export interface ProcessedDocument {
  pages: Page[],
  data: DocumentData,
}

export namespace Form1003 {
  export enum FieldId {
    LENDER_LOAN_NUMBER = "lender_loan_number",
    BORROWER_FORMER_ADDRESS_STATE_1A = "borrower_former_address_state_1a",
    BORROWER_EMAIL_1A = "borrower_email_1a",
    BORROWER_FORMER_ADDRESS_DOESNT_APPLY_1A =
      "borrower_former_address_doesnt_apply_1a",
    BORROWER_CURRENT_ADDRESS_ZIP_1A = "borrower_current_address_zip_1a",
    BORROWER_CURRENT_ADDRESS_STREET_1A = "borrower_current_address_street_1a",
    BORROWER_MAILING_ADDRESS_DOESNT_APPLY_1A =
      "borrower_mailing_address_doesnt_apply_1a",
    BORROWER_CURRENT_ADDRESS_HOUSING_TYPE =
      "borrower_current_address_housing_type",
    BORROWER_HOME_PHONE_1A = "borrower_home_phone_1a",
    BORROWER_FORMER_ADDRESS_RENT_PRICE_1A =
      "borrower_former_address_rent_price_1a",
    BORROWER_DEPENDANTS_NUMBER_1A = "borrower_dependants_number_1a",
    BORROWER_MARTIAL_STATUS = "borrower_martial_status",
    BORROWER_FORMER_ADDRESS_HOUSING_TYPE_1A =
      "borrower_former_address_housing_type_1a",
    BORROWER_CURRENT_ADDRESS_CITY_1A = "borrower_current_address_city_1a",
    BORROWER_DEPENDANTS_AGES_1A = "borrower_dependants_ages_1a",
    BORROWER_NAME_1A = "borrower_name_1a",
    BORROWER_FORMER_ADDRESS_LIVED_YEARS_1A =
      "borrower_former_address_lived_years_1a",
    BORROWER_FORMER_ADDRESS_STREET_1A = "borrower_former_address_street_1a",
    BORROWER_CURRENT_ADDRESS_STATE_1A = "borrower_current_address_state_1a",
    BORROWER_SOCIAL_SECURITY_NUMBER_1A = "borrower_social_security_number_1a",
    BORROWER_WORK_PHONE_1A = "borrower_work_phone_1a",
    BORROWER_CELL_PHONE_1A = "borrower_cell_phone_1a",
    BORROWER_FORMER_ADDRESS_LIVED_MONTHS_1A =
      "borrower_former_address_lived_months_1a",
    BORROWER_FORMER_ADDRESS_CITY_1A = "borrower_former_address_city_1a",
    BORROWER_CURRENT_ADDRESS_RENT_PRICE_1A =
      "borrower_current_address_rent_price_1a",
    BORROWER_CURRENT_ADDRESS_UNIT_1A = "borrower_current_address_unit_1a",
    BORROWER_FORMER_ADDRESS_ZIP_1A = "borrower_former_address_zip_1a",
    AGENCY_CASE_NUMBER = "agency_case_number",
    BORROWER_CURRENT_ADDRESS_COUNTRY_1A = "borrower_current_address_country_1a",
    TYPE_OF_CREDIT_1A = "type_of_credit_1a",
    BORROWER_DATE_OF_BIRTH_1A = "borrower_date_of_birth_1a",
    BORROWER_FORMER_ADDRESS_COUNTRY_1A = "borrower_former_address_country_1a",
    BORROWER_CITIZENSHIP_1A = "borrower_citizenship_1a",
    BORROWER_CURRENT_ADDRESS_LIVED_YEARS_1A =
      "borrower_current_address_lived_years_1a",
    BORROWER_CURRENT_ADDRESS_LIVED_MONTHS_1A =
      "borrower_current_address_lived_months_1a",
    BORROWER_FORMER_ADDRESS_UNIT_1A = "borrower_former_address_unit_1a",
  }

  export interface DocumentFieldModel {
    label: string;
    key: FieldId;
  }

  export interface DocumentEntityFieldsModel { [key: string]: DocumentFieldModel };

  interface IEntity {
    label: string;
    fields: DocumentEntityFieldsModel;
  }

  export type DocumentModel = { [key: string]: IEntity };

  export const documentModel:  DocumentModel = {
    borrower: {
      label: "Borrower",
      fields: {
        name: { key: FieldId.BORROWER_NAME_1A, label: "Name" },
        ssn: { key: FieldId.BORROWER_SOCIAL_SECURITY_NUMBER_1A, label: "SSN" },
        dob: { key: FieldId.BORROWER_DATE_OF_BIRTH_1A, label: "Date of Birth" },
        citizenship: {
          key: FieldId.BORROWER_CITIZENSHIP_1A,
          label: "Citizenship",
        },
        martialStatus: {
          key: FieldId.BORROWER_MARTIAL_STATUS,
          label: "Martial status",
        },
        phoneHome: { key: FieldId.BORROWER_HOME_PHONE_1A, label: "Home phone" },
        phoneCell: { key: FieldId.BORROWER_CELL_PHONE_1A, label: "Cell phone" },
        phoneWork: { key: FieldId.BORROWER_WORK_PHONE_1A, label: "Work phone" },
        email: { key: FieldId.BORROWER_EMAIL_1A, label: "Email" },
      },
    },
    currentAddress: {
      label: "Current Address",
      fields: {
        street: {
          key: FieldId.BORROWER_CURRENT_ADDRESS_STREET_1A,
          label: "Street",
        },
        city: { key: FieldId.BORROWER_CURRENT_ADDRESS_CITY_1A, label: "City" },
        state: {
          key: FieldId.BORROWER_CURRENT_ADDRESS_STATE_1A,
          label: "State",
        },
        zip: { key: FieldId.BORROWER_CURRENT_ADDRESS_ZIP_1A, label: "ZIP" },
        country: {
          key: FieldId.BORROWER_CURRENT_ADDRESS_COUNTRY_1A,
          label: "Country",
        },
        livedYears: {
          key: FieldId.BORROWER_CURRENT_ADDRESS_LIVED_YEARS_1A,
          label: "Lived years",
        },
        livedMonths: {
          key: FieldId.BORROWER_CURRENT_ADDRESS_LIVED_MONTHS_1A,
          label: "Lived months",
        },
      },
    },
  };

  export type EntityId = keyof typeof documentModel;
  export type FieldTypes = keyof typeof documentModel[EntityId]['fields']


  export type FlatFormFieldsMap = { [key in FieldId]: DocumentFieldValue };
 
}
