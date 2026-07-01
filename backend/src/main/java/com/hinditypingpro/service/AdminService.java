package com.hinditypingpro.service;

import com.hinditypingpro.dto.AdminStatsDto;
import com.hinditypingpro.entity.Payment;
import com.hinditypingpro.repository.PaymentRepository;
import com.hinditypingpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public AdminStatsDto getStats() {
        long totalUsers = userRepository.count();
        long premiumUsers = userRepository.countByIsPremiumTrue();
        long totalPayments = paymentRepository.countByStatus(Payment.Status.PAID);
        Long revenuePaise = paymentRepository.sumAmountByStatus(Payment.Status.PAID);
        long totalRevenuePaise = revenuePaise != null ? revenuePaise : 0L;
        double conversionRate = totalUsers > 0 ? Math.round((premiumUsers * 1000.0 / totalUsers)) / 10.0 : 0;

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .premiumUsers(premiumUsers)
                .totalPayments(totalPayments)
                .totalRevenuePaise(totalRevenuePaise)
                .conversionRate(conversionRate)
                .build();
    }
}
