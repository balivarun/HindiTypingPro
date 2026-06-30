package com.hinditypingpro.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:}")
    private String datasourceUsername;

    @Value("${spring.datasource.password:}")
    private String datasourcePassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String jdbcUrl;
        String username = datasourceUsername;
        String password = datasourcePassword;

        // Render provides URLs in the form: postgresql://user:pass@host:port/db
        // JDBC needs:                        jdbc:postgresql://host:port/db
        // This block handles both formats transparently.
        if (datasourceUrl.startsWith("postgresql://") || datasourceUrl.startsWith("postgres://")) {
            URI uri = URI.create(datasourceUrl);

            String userInfo = uri.getUserInfo();
            if (userInfo != null && !userInfo.isBlank()) {
                int colon = userInfo.indexOf(':');
                if (colon > 0) {
                    username = userInfo.substring(0, colon);
                    password = userInfo.substring(colon + 1);
                } else {
                    username = userInfo;
                }
            }

            int port = uri.getPort();
            String portPart = port > 0 ? ":" + port : "";
            jdbcUrl = "jdbc:postgresql://" + uri.getHost() + portPart + uri.getPath();
        } else {
            // Already a valid JDBC URL (jdbc:postgresql://...)
            jdbcUrl = datasourceUrl;
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(5);        // safe for Render free tier
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
