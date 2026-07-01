package com.hinditypingpro.service;

import com.hinditypingpro.entity.Coupon;
import com.hinditypingpro.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public record CouponValidation(boolean valid, String message, int discountPercent, int finalAmountPaise) {}

    public CouponValidation validateCoupon(String code, int originalAmountPaise) {
        Optional<Coupon> opt = couponRepository.findByCodeIgnoreCase(code.trim());
        if (opt.isEmpty()) {
            return new CouponValidation(false, "Invalid coupon code", 0, originalAmountPaise);
        }
        Coupon coupon = opt.get();
        if (!coupon.getActive()) {
            return new CouponValidation(false, "Coupon is no longer active", 0, originalAmountPaise);
        }
        if (coupon.getMaxUses() != null && coupon.getUsedCount() >= coupon.getMaxUses()) {
            return new CouponValidation(false, "Coupon usage limit reached", 0, originalAmountPaise);
        }
        int discountPaise = (originalAmountPaise * coupon.getDiscountPercent()) / 100;
        int finalAmount = Math.max(originalAmountPaise - discountPaise, 100);
        return new CouponValidation(true,
                coupon.getDiscountPercent() + "% discount applied",
                coupon.getDiscountPercent(), finalAmount);
    }

    @Transactional
    public void applyCoupon(String code) {
        couponRepository.findByCodeIgnoreCase(code.trim()).ifPresent(c -> {
            c.setUsedCount(c.getUsedCount() + 1);
            couponRepository.save(c);
        });
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon createCoupon(String code, int discountPercent, Integer maxUses) {
        Coupon coupon = Coupon.builder()
                .code(code.toUpperCase().trim())
                .discountPercent(discountPercent)
                .maxUses(maxUses)
                .build();
        return couponRepository.save(coupon);
    }

    @Transactional
    public void toggleCoupon(Long id) {
        couponRepository.findById(id).ifPresent(c -> {
            c.setActive(!c.getActive());
            couponRepository.save(c);
        });
    }

    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }
}
