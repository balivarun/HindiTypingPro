package com.hinditypingpro.config;

import com.hinditypingpro.entity.TypingTest;
import com.hinditypingpro.entity.User;
import com.hinditypingpro.repository.TypingTestRepository;
import com.hinditypingpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final TypingTestRepository testRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedTypingTests();
    }

    private void seedAdmin() {
        // Remove the old placeholder admin if it still exists
        userRepository.findByEmail("admin@hinditypingpro.com").ifPresent(old -> {
            userRepository.delete(old);
            log.info("Removed old placeholder admin: admin@hinditypingpro.com");
        });

        if (!userRepository.existsByEmail("varunbali47@gmail.com")) {
            User admin = User.builder()
                    .name("Varun Bali")
                    .email("varunbali47@gmail.com")
                    .password(passwordEncoder.encode("qwerty"))
                    .role(User.Role.ADMIN)
                    .isPremium(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user seeded: varunbali47@gmail.com");
        }
    }

    private void seedTypingTests() {
        if (testRepository.count() > 0) return;

        List<TypingTest> tests = List.of(
            TypingTest.builder()
                .title("भारत का संविधान")
                .paragraph("भारत एक लोकतांत्रिक गणराज्य है। यहाँ सभी नागरिकों को समान अधिकार प्राप्त हैं। संविधान देश का सर्वोच्च कानून है। न्याय, स्वतंत्रता और समानता हमारे मूल अधिकार हैं।")
                .difficulty(TypingTest.Difficulty.BEGINNER)
                .build(),
            TypingTest.builder()
                .title("हमारा देश")
                .paragraph("हमारा देश भारत बहुत सुंदर है। यहाँ अनेक नदियाँ और पहाड़ हैं। गंगा, यमुना और ब्रह्मपुत्र प्रमुख नदियाँ हैं। हिमालय उत्तर में स्थित है।")
                .difficulty(TypingTest.Difficulty.BEGINNER)
                .build(),
            TypingTest.builder()
                .title("SSC परीक्षा अभ्यास")
                .paragraph("कर्मचारी चयन आयोग देश के विभिन्न मंत्रालयों और विभागों में भर्ती करता है। इस परीक्षा में हिंदी टाइपिंग एक महत्वपूर्ण भाग है। उम्मीदवारों को प्रति मिनट पच्चीस शब्द टाइप करने होते हैं। नियमित अभ्यास से गति और शुद्धता दोनों में सुधार होता है।")
                .difficulty(TypingTest.Difficulty.INTERMEDIATE)
                .build(),
            TypingTest.builder()
                .title("न्यायालय लेखन परीक्षा")
                .paragraph("न्यायालय में हिंदी टाइपिंग परीक्षा अत्यंत महत्वपूर्ण होती है। इसमें शुद्धता और गति दोनों का मूल्यांकन किया जाता है। परीक्षार्थियों को दिए गए अनुच्छेद को बिना गलती किए टाइप करना होता है। अभ्यास ही सफलता की कुंजी है।")
                .difficulty(TypingTest.Difficulty.INTERMEDIATE)
                .build(),
            TypingTest.builder()
                .title("HSSC उन्नत अभ्यास")
                .paragraph("हरियाणा कर्मचारी चयन आयोग की परीक्षाओं में हिंदी टाइपिंग की महत्वपूर्ण भूमिका है। उन्नत स्तर पर उम्मीदवारों को प्रति मिनट पैंतीस से अधिक शब्द टाइप करने की आवश्यकता होती है। इसके लिए नियमित और व्यवस्थित अभ्यास अपरिहार्य है। कृतिदेव, रेमिंगटन और इनस्क्रिप्ट लेआउट में दक्षता आवश्यक है।")
                .difficulty(TypingTest.Difficulty.ADVANCED)
                .build(),
            TypingTest.builder()
                .title("उच्च गति टाइपिंग")
                .paragraph("उच्च गति टाइपिंग के लिए उंगलियों की सही स्थिति अत्यंत महत्वपूर्ण है। होम रो पर उंगलियाँ रखकर अभ्यास करने से गति में वृद्धि होती है। प्रत्येक अक्षर के लिए निर्धारित उंगली का उपयोग करना चाहिए। दैनिक अभ्यास से मस्तिष्क और उंगलियों में समन्वय स्थापित होता है जिससे टाइपिंग गति स्वाभाविक रूप से बढ़ती है।")
                .difficulty(TypingTest.Difficulty.ADVANCED)
                .build(),
            TypingTest.builder()
                .title("विज्ञान और प्रौद्योगिकी")
                .paragraph("विज्ञान ने मानव जीवन को बदल दिया है। कंप्यूटर और इंटरनेट ने संचार क्रांति लाई है। आज हम घर बैठे दुनिया से जुड़ सकते हैं।")
                .difficulty(TypingTest.Difficulty.BEGINNER)
                .build(),
            TypingTest.builder()
                .title("पर्यावरण संरक्षण")
                .paragraph("पर्यावरण प्रदूषण आज की सबसे बड़ी समस्या है। वायु प्रदूषण, जल प्रदूषण और भूमि प्रदूषण मानव स्वास्थ्य के लिए हानिकारक हैं। वृक्षारोपण और सौर ऊर्जा का उपयोग इस समस्या का समाधान है। प्रत्येक नागरिक को पर्यावरण की रक्षा का संकल्प लेना चाहिए।")
                .difficulty(TypingTest.Difficulty.INTERMEDIATE)
                .build()
        );

        testRepository.saveAll(tests);
        log.info("Seeded {} typing tests", tests.size());
    }
}
