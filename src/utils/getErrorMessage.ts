import axios from "axios";

// utils/getErrorMessage.ts
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message || // Spring ResponseStatusException message
            error.response?.data?.error ||   // fallback: sometimes Spring sends this
            error.response?.data ||          // raw text fallback
            error.message ||
            "Unknown Axios error"
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}
