/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: drivers
 * Interface for Drivers
 */
export interface Drivers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  firstName?: string;
  /** @wixFieldType text */
  lastName?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  driverPhoto?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  licenseNumber?: string;
  /** @wixFieldType date */
  licenseExpiryDate?: Date | string;
  /** @wixFieldType text */
  licenseStatus?: string;
  /** @wixFieldType number */
  safetyScore?: number;
  /** @wixFieldType number */
  tripCompletionRate?: number;
  /** @wixFieldType text */
  dutyStatus?: string;
}


/**
 * Collection ID: expenses
 * Interface for Expenses
 */
export interface Expenses {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType date */
  expenseDate?: Date | string;
  /** @wixFieldType text */
  expenseCategory?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  amount?: number;
  /** @wixFieldType number */
  quantity?: number;
  /** @wixFieldType text */
  unitOfMeasure?: string;
}


/**
 * Collection ID: maintenancelogs
 * Interface for MaintenanceLogs
 */
export interface MaintenanceLogs {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  vehicleLicensePlate?: string;
  /** @wixFieldType text */
  maintenanceType?: string;
  /** @wixFieldType date */
  serviceDate?: Date | string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  serviceCost?: number;
  /** @wixFieldType text */
  mechanicName?: string;
  /** @wixFieldType text */
  vehicleStatusAfterService?: string;
}


/**
 * Collection ID: trips
 * Interface for Trips
 */
export interface Trips {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  tripNumber?: string;
  /** @wixFieldType text */
  cargoDetails?: string;
  /** @wixFieldType number */
  cargoWeight?: number;
  /** @wixFieldType text */
  tripStatus?: string;
  /** @wixFieldType text */
  startLocation?: string;
  /** @wixFieldType text */
  endLocation?: string;
  /** @wixFieldType datetime */
  scheduledStartTime?: Date | string;
  /** @wixFieldType datetime */
  scheduledEndTime?: Date | string;
  /** @wixFieldType datetime */
  actualStartTime?: Date | string;
  /** @wixFieldType datetime */
  actualEndTime?: Date | string;
}


/**
 * Collection ID: vehicles
 * Interface for Vehicles
 */
export interface Vehicles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  model?: string;
  /** @wixFieldType text */
  licensePlate?: string;
  /** @wixFieldType text */
  vehicleType?: string;
  /** @wixFieldType number */
  maxLoadCapacity?: number;
  /** @wixFieldType number */
  odometer?: number;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType text */
  region?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  vehicleImage?: string;
}
