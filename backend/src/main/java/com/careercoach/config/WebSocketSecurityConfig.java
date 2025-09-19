package com.careercoach.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.careercoach.utility.JwtTokenUtil;

import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Extract authentication from headers
                    String authToken = accessor.getFirstNativeHeader("Authorization");
                    
                    if (authToken != null && authToken.startsWith("Bearer ")) {
                        // Here you would typically validate the JWT token
                        // For now, we'll extract the username from the token
                        String token = authToken.substring(7);
                        
                        try {
                            // Use proper JWT token validation
                            if (jwtTokenUtil.validateToken(token)) {
                                String username = jwtTokenUtil.getUsernameFromToken(token);
                                
                                if (username != null) {
                                    Authentication auth = new UsernamePasswordAuthenticationToken(
                                        username, null, null);
                                    SecurityContextHolder.getContext().setAuthentication(auth);
                                    accessor.setUser(auth);
                                    log.info("WebSocket connection authenticated for user: {}", username);
                                } else {
                                    log.warn("Failed to extract username from valid JWT token");
                                }
                            } else {
                                log.warn("Invalid JWT token for WebSocket connection");
                            }
                        } catch (Exception e) {
                            log.error("Failed to authenticate WebSocket connection: {}", e.getMessage());
                        }
                    } else {
                        log.warn("WebSocket connection attempted without proper authentication");
                    }
                }
                
                return message;
            }
        });
    }
}