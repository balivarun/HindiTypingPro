package com.hinditypingpro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDto {
    private long totalUsers;
    private long premiumUsers;
    private long totalPayments;
    private long totalRevenuePaise;
    private double conversionRate;
}
