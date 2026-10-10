package com.smartride.service;

import com.smartride.dto.request.UserProfileUpdateRequest;
import com.smartride.dto.response.UserDto;
import com.smartride.entity.User;
import com.smartride.exception.ResourceNotFoundException;
import com.smartride.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setName(request.getName().trim());
        user.setPhone(request.getPhone().trim());

        User updatedUser = userRepository.save(user);
        return UserDto.fromEntity(updatedUser);
    }
}
