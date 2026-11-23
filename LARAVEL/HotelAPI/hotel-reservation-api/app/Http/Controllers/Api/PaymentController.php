<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\PaymentServiceInterface;
use App\DTOs\ProcessPaymentDTO;
use App\Http\Requests\ProcessPaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class PaymentController
 * 
 * Controlador de Pagos.
 * Cumple con la función: "Gestionar pagos".
 */
class PaymentController extends BaseApiController
{
    public function __construct(
        protected PaymentServiceInterface $paymentService
    ) {}

    /**
     * Listar todos los pagos registrados.
     * GET /api/v1/payments
     */
    public function index(): JsonResponse
    {
        $payments = Payment::with('reservation')->latest()->get();

        return $this->successResponse(
            PaymentResource::collection($payments),
            'Listado de pagos recuperado exitosamente.'
        );
    }

    /**
     * Ver un pago específico por ID.
     * GET /api/v1/payments/{id}
     */
    public function show(int $id): JsonResponse
    {
        $payment = Payment::with('reservation')->find($id);

        if (!$payment) {
            return $this->errorResponse('Pago no encontrado.', Response::HTTP_NOT_FOUND);
        }

        return $this->successResponse(new PaymentResource($payment), 'Detalle del pago recuperado.');
    }

    /**
     * Gestionar y procesar el pago de una reserva.
     * POST /api/v1/payments
     */
    public function store(ProcessPaymentRequest $request): JsonResponse
    {
        try {
            $dto = ProcessPaymentDTO::fromArray($request->validated());
            $payment = $this->paymentService->processPayment($dto);

            return $this->successResponse(
                new PaymentResource($payment),
                'Pago procesado exitosamente. La reserva ha sido confirmada.',
                Response::HTTP_CREATED
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                $e->getMessage(),
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }
    }
}
