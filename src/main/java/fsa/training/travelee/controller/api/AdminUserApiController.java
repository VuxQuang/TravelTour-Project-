package fsa.training.travelee.controller.api;

import fsa.training.travelee.dto.RegisterUserAdminDto;
import fsa.training.travelee.entity.User;
import fsa.training.travelee.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import fsa.training.travelee.repository.UserRepository;
import fsa.training.travelee.repository.RoleRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserApiController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "keyword", required = false) String keyword,
            Pageable pageable
    ) {
        Page<User> usersPage = userService.getUsersPage(
                keyword,
                pageable.getPageNumber(),
                pageable.getPageSize()
        );
        List<Map<String, Object>> items = usersPage.getContent().stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("username", u.getUsername());
            m.put("email", u.getEmail());
            m.put("fullName", u.getFullName());
            m.put("status", u.getStatus());
            java.util.List<String> roleNames = u.getRoles().stream().map(r -> r.getRoleName()).toList();
            m.put("roles", roleNames);
            m.put("roleNames", roleNames);
            return m;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("totalPages", usersPage.getTotalPages());
        result.put("totalItems", usersPage.getTotalElements());
        result.put("page", usersPage.getNumber());
        result.put("size", usersPage.getSize());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> create(@RequestBody RegisterUserAdminDto dto) {
        userService.createUserAdmin(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> getOne(@PathVariable Long id) {

        var opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var u = opt.get();
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("email", u.getEmail());
        m.put("fullName", u.getFullName());
        m.put("status", u.getStatus());
        m.put("phoneNumber", u.getPhoneNumber());
        m.put("address", u.getAddress());
        m.put("createdAt", u.getCreatedAt());
        m.put("updatedAt", u.getUpdatedAt());
        java.util.List<String> roleNames = u.getRoles().stream().map(r -> r.getRoleName()).toList();
        m.put("roles", roleNames);
        m.put("roleNames", roleNames);
        return ResponseEntity.ok(m);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody fsa.training.travelee.dto.RegisterUserAdminDto dto) {
        try {
            dto.setId(id);
            userService.updateUserAdmin(dto);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public ResponseEntity<List<Map<String, Object>>> getRoles() {
        List<Map<String, Object>> roles = roleRepository.findAll().stream().map(role -> {
            Map<String, Object> roleMap = new HashMap<>();
            roleMap.put("roleId", role.getRoleId());
            roleMap.put("roleName", role.getRoleName());
            return roleMap;
        }).toList();
        return ResponseEntity.ok(roles);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}


