// src/services/types/baseResponse.ts

// Generic base response for any API call
export interface BaseResponseDTO<T = any> {
  success: boolean;
  status: number;
  message: string;
  totalcount:number;
  data?: T | null;
}

// Base error response (optional)
export interface BaseErrorResponseDTO {
  success: boolean;
  status: number;
  message: string;
}

// Base success response (optional)
export interface BaseSuccessResponseDTO<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T | null;
}
