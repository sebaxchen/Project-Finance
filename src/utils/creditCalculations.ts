export interface PaymentScheduleItem {
  period_number: number;
  payment_date: string;
  beginning_balance: number;
  principal_payment: number;
  interest_payment: number;
  insurance_payment: number;
  total_payment: number;
  ending_balance: number;
  grace_period: boolean;
}

export interface CreditCalculationParams {
  loan_amount: number;
  annual_interest_rate: number;
  interest_rate_type: 'nominal' | 'effective';
  capitalization?: 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual';
  loan_term_years: number;
  grace_period_type: 'none' | 'total' | 'partial';
  grace_period_months: number;
  insurance_rate: number;
  start_date?: Date;
}

export interface CreditCalculationResult {
  payment_schedule: PaymentScheduleItem[];
  tea: number;
  tcea: number;
  van: number;
  tir: number;
}

/**
 * Obtiene el número de períodos de capitalización por año
 */
function getCapitalizationPeriodsPerYear(capitalization: string): number {
  const periods: Record<string, number> = {
    monthly: 12,
    bimonthly: 6,
    quarterly: 4,
    semiannual: 2,
    annual: 1,
  };
  return periods[capitalization] || 12;
}

/**
 * Convierte una tasa nominal a tasa efectiva anual
 * TEA = (1 + TN/m)^m - 1
 * donde m = períodos de capitalización por año
 */
function nominalToEffectiveRate(nominalRate: number, capitalization: string): number {
  const m = getCapitalizationPeriodsPerYear(capitalization);
  // La tasa nominal viene como decimal (ej: 0.08 para 8%)
  return Math.pow(1 + nominalRate / m, m) - 1;
}

/**
 * Calcula la tasa mensual efectiva para meses de 30 días
 * Tasa mensual = (1 + TEA)^(30/360) - 1
 */
function calculateMonthlyRate30Days(effectiveAnnualRate: number): number {
  const days_per_month = 30;
  const days_per_year = 360;
  return Math.pow(1 + effectiveAnnualRate, days_per_month / days_per_year) - 1;
}

/**
 * Calcula el cronograma de pagos usando el método francés vencido ordinario
 * (meses de 30 días) según las normas del Fondo MiVivienda
 */
export function calculateCreditSchedule(params: CreditCalculationParams): CreditCalculationResult {
  const {
    loan_amount,
    annual_interest_rate,
    interest_rate_type,
    capitalization,
    loan_term_years,
    grace_period_type,
    grace_period_months,
    insurance_rate,
    start_date = new Date(),
  } = params;

  // Método francés vencido ordinario: meses de 30 días
  // Constantes para cálculos financieros peruanos
  const days_per_month = 30;
  const days_per_year = 360; // Año comercial para cálculos financieros
  
  // Paso 1: Calcular TEA (Tasa Efectiva Anual)
  let tea = annual_interest_rate;
  if (interest_rate_type === 'nominal' && capitalization) {
    tea = nominalToEffectiveRate(annual_interest_rate, capitalization);
  }
  
  // Paso 2: Calcular tasa mensual efectiva (30 días)
  // Tasa mensual = (1 + TEA)^(30/360) - 1
  const monthly_rate = calculateMonthlyRate30Days(tea);
  
  // Paso 3: Calcular seguro mensual (30 días)
  // El seguro incluye: Seguro de Desgravamen + Seguro del Bien
  // En el mercado peruano, típicamente:
  // - Seguro de Desgravamen: ~0.10% mensual del saldo (1.2% anual)
  // - Seguro del Bien: ~0.03% mensual del valor del bien (0.36% anual)
  // Total aproximado: ~0.33% anual del saldo del préstamo
  // El seguro viene como tasa anual, se prorratea proporcionalmente a 30 días
  // Tasa mensual de seguro = (Tasa anual / 360) * 30
  // Esto es consistente con el cálculo proporcional usado en el sector financiero peruano
  const monthly_insurance_rate = (insurance_rate / days_per_year) * days_per_month;
  
  const total_periods = loan_term_years * 12;
  const payment_periods = total_periods - grace_period_months;

  const schedule: PaymentScheduleItem[] = [];
  let balance = loan_amount;
  let current_date = new Date(start_date);

  // Paso 4: Calcular cuota fija del método francés
  // Si hay período de gracia total, el saldo aumenta por capitalización de intereses
  let adjusted_balance = balance;
  if (grace_period_type === 'total' && grace_period_months > 0) {
    // Capitalizar intereses durante el período de gracia total
    for (let g = 0; g < grace_period_months; g++) {
      adjusted_balance = adjusted_balance * (1 + monthly_rate);
    }
  }
  
  // Cuota = P * [i(1+i)^n] / [(1+i)^n - 1]
  // donde: P = préstamo ajustado (si hubo gracia total), i = tasa mensual, n = número de períodos de pago
  let fixed_payment = 0;
  if (payment_periods > 0) {
    const numerator = monthly_rate * Math.pow(1 + monthly_rate, payment_periods);
    const denominator = Math.pow(1 + monthly_rate, payment_periods) - 1;
    fixed_payment = adjusted_balance * (numerator / denominator);
  }

  // Paso 5: Generar cronograma de pagos
  // Si hay gracia total, usar el saldo ajustado (ya capitalizado)
  // Si no hay gracia total, usar el saldo original
  let current_balance = adjusted_balance;
  
  for (let period = 1; period <= total_periods; period++) {
    const is_grace_period = period <= grace_period_months;
    
    // Interés calculado sobre el saldo actual (método francés vencido)
    const interest_payment = current_balance * monthly_rate;
    
    // Seguro calculado sobre el saldo actual
    // Incluye: Seguro de Desgravamen + Seguro del Bien
    // Se calcula mensualmente sobre el saldo pendiente del préstamo
    const insurance_payment = current_balance * monthly_insurance_rate;

    let principal_payment = 0;
    let total_payment = 0;
    let ending_balance = current_balance;

    if (is_grace_period) {
      if (grace_period_type === 'total') {
        // Gracia total: solo se paga seguro, el interés ya fue capitalizado
        // El saldo no cambia durante la gracia total (ya está capitalizado)
        principal_payment = 0;
        total_payment = insurance_payment;
        ending_balance = current_balance; // El saldo se mantiene igual
      } else if (grace_period_type === 'partial') {
        // Gracia parcial: se paga interés y seguro, no capital
        principal_payment = 0;
        total_payment = interest_payment + insurance_payment;
        ending_balance = current_balance; // El saldo se mantiene igual (no se paga capital)
      }
    } else {
      // Período normal: método francés
      // La cuota fija incluye capital + interés
      principal_payment = fixed_payment - interest_payment;
      // Asegurar que el principal no sea negativo
      if (principal_payment < 0) principal_payment = 0;
      // En el último período, ajustar para que el saldo final sea exactamente 0
      // Esto corrige errores de redondeo acumulados
      if (period === total_periods || current_balance - principal_payment < 0.01) {
        principal_payment = current_balance;
        total_payment = principal_payment + interest_payment + insurance_payment;
        ending_balance = 0;
      } else {
        total_payment = fixed_payment + insurance_payment;
        ending_balance = current_balance - principal_payment;
      }
    }

    // Redondear a 2 decimales para evitar errores de precisión
    const rounded_ending_balance = Math.round(ending_balance * 100) / 100;

    schedule.push({
      period_number: period,
      // Fecha de pago: agregar 30 días (mes comercial)
      payment_date: new Date(current_date).toISOString().split('T')[0],
      beginning_balance: Math.round(current_balance * 100) / 100,
      principal_payment: Math.round(principal_payment * 100) / 100,
      interest_payment: Math.round(interest_payment * 100) / 100,
      insurance_payment: Math.round(insurance_payment * 100) / 100,
      total_payment: Math.round(total_payment * 100) / 100,
      ending_balance: rounded_ending_balance > 0.01 ? rounded_ending_balance : 0,
      grace_period: is_grace_period,
    });

    current_balance = rounded_ending_balance > 0.01 ? rounded_ending_balance : 0;
    // Avanzar 30 días (mes comercial)
    current_date.setDate(current_date.getDate() + days_per_month);
  }

  // Paso 6: Calcular indicadores financieros según normas peruanas
  
  // TEA ya está calculada arriba
  
  // TIR (Tasa Interna de Retorno) - usando períodos de 30 días
  // Flujo de caja desde la perspectiva del prestatario:
  // - Desembolso inicial (préstamo recibido): positivo
  // - Pagos realizados: negativos
  const cash_flows = [loan_amount, ...schedule.map((s) => -s.total_payment)];
  const tir_monthly = calculateIRR(cash_flows);
  
  // Validar TIR antes de convertir
  let tir = 0;
  if (isFinite(tir_monthly) && !isNaN(tir_monthly) && tir_monthly > -1 && tir_monthly < 10) {
    // Convertir TIR mensual a anual: TIR_anual = (1 + TIR_mensual)^(360/30) - 1
    const tir_annual = Math.pow(1 + tir_monthly, days_per_year / days_per_month) - 1;
    // Validar que sea razonable
    if (isFinite(tir_annual) && !isNaN(tir_annual) && tir_annual > -1 && tir_annual < 10) {
      tir = tir_annual;
    }
  }

  // VAN (Valor Actual Neto) - usando meses de 30 días (año de 360 días)
  // VAN = -Préstamo + Σ(Pagos / (1 + TEA)^(días/360))
  // El préstamo se recibe al inicio (día 0), los pagos se realizan al final de cada período
  let van = -loan_amount;
  for (let i = 0; i < schedule.length; i++) {
    // Descontar usando días: (1 + TEA)^(días/360)
    // El primer pago es al final del primer mes (30 días), el segundo al final del segundo mes (60 días), etc.
    const days_elapsed = (i + 1) * days_per_month;
    const discount_factor = Math.pow(1 + tea, days_elapsed / days_per_year);
    if (isFinite(discount_factor) && discount_factor > 0) {
      van += schedule[i].total_payment / discount_factor;
    }
  }
  // Redondear VAN
  van = Math.round(van * 100) / 100;

  // TCEA (Tasa de Costo Efectiva Anual) - según normas peruanas
  // TCEA incluye todos los costos: intereses, seguros, comisiones
  // Se calcula usando la TIR de todos los flujos de caja (préstamo recibido y todos los pagos)
  const total_paid = schedule.reduce((sum, s) => sum + s.total_payment, 0);
  
  // Validar que haya pagos y que el total sea mayor que el préstamo
  let tcea_final = tea; // Por defecto igual a TEA
  
  if (total_paid > loan_amount && loan_amount > 0) {
    // Calcular TCEA usando TIR de todos los flujos de caja
    // Flujo de caja: préstamo recibido (positivo) y todos los pagos (negativos)
    const tcea_cash_flows = [loan_amount, ...schedule.map((s) => -s.total_payment)];
    const tcea_tir_monthly = calculateIRR(tcea_cash_flows);
    
    if (isFinite(tcea_tir_monthly) && !isNaN(tcea_tir_monthly) && tcea_tir_monthly > -1 && tcea_tir_monthly < 10) {
      // Convertir TIR mensual a anual: TCEA = (1 + TIR_mensual)^(360/30) - 1
      const tcea_calc = Math.pow(1 + tcea_tir_monthly, days_per_year / days_per_month) - 1;
      
      // Validar que TCEA sea razonable (entre -50% y 1000%)
      if (isFinite(tcea_calc) && !isNaN(tcea_calc) && tcea_calc > -0.5 && tcea_calc < 10) {
        // TCEA debe ser >= TEA (incluye costos adicionales como seguros)
        tcea_final = Math.max(tcea_calc, tea);
      }
    }
  }

  return {
    payment_schedule: schedule,
    tea: Math.round(tea * 1000000) / 1000000, // Redondear a 6 decimales
    tcea: Math.round(tcea_final * 1000000) / 1000000, // Redondear a 6 decimales
    van: van,
    tir: Math.round(tir * 1000000) / 1000000, // Redondear a 6 decimales
  };
}

/**
 * Calcula la Tasa Interna de Retorno (TIR) usando el método de Newton-Raphson
 * @param cashFlows Flujos de caja (primer elemento es el desembolso inicial)
 * @param guess Valor inicial para la iteración (tasa mensual)
 * @returns Tasa mensual efectiva
 */
function calculateIRR(cashFlows: number[], guess: number = 0.01): number {
  const maxIterations = 100;
  const tolerance = 0.0000001;

  // Validar que hay flujos positivos y negativos
  const hasPositive = cashFlows.some(cf => cf > 0);
  const hasNegative = cashFlows.some(cf => cf < 0);
  
  if (!hasPositive || !hasNegative || cashFlows.length < 2) {
    return 0; // No se puede calcular TIR
  }

  // Validar que el primer flujo sea positivo (préstamo recibido)
  if (cashFlows[0] <= 0) {
    return 0;
  }

  let rate = guess;
  
  // Intentar diferentes valores iniciales si el primero falla
  const initialGuesses = [0.01, 0.05, 0.1, 0.2, 0.5];
  
  for (const initialGuess of initialGuesses) {
    rate = initialGuess;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let dnpv = 0;

      for (let t = 0; t < cashFlows.length; t++) {
        const discount_factor = Math.pow(1 + rate, t);
        if (!isFinite(discount_factor) || discount_factor === 0) {
          break;
        }
        npv += cashFlows[t] / discount_factor;
        dnpv += (-t * cashFlows[t]) / (discount_factor * (1 + rate));
      }

      // Evitar división por cero
      if (Math.abs(dnpv) < 0.0000001) {
        break;
      }

      const newRate = rate - npv / dnpv;

      // Validar que la nueva tasa sea razonable
      if (!isFinite(newRate) || isNaN(newRate) || newRate < -0.99 || newRate > 10) {
        break;
      }

      if (Math.abs(newRate - rate) < tolerance) {
        // Validar que la tasa final sea razonable
        if (newRate > -0.99 && newRate < 10) {
          return newRate;
        }
        break;
      }

      rate = newRate;
    }
  }

  // Si no se encontró una solución válida, retornar 0
  return 0;
}
