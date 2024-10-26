export class SensorNotFoundError extends Error {
    constructor(message: string = 'Sensor not found') {
        super(message);
        this.name = 'SensorNotFoundError';
    }
}

export class InvalidStatusError extends Error {
    constructor(message: string = 'Invalid status') {
        super(message);
        this.name = 'InvalidStatusError';
    }
}

export class InternalServerError extends Error {
    constructor(message: string = 'Internal Server Error') {
        super(message);
        this.name = 'InternalServerError';
    }
}