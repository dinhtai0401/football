const errors: any = {
    server_error: {
        message: 'Internal server error'
    },
    database_error: {
        message: 'Database error'
    },
    duplicated_value: {
        message: 'Duplicated value'
    },
    invalid_request: {
        message: 'Invalid request'
    }
};

export const getErrorMessage = (error: string): string => {
    if (error in errors) {
        return errors[error].message;
    }
    return 'General error';
};
