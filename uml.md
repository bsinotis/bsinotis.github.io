classDiagram
    %% ==========================================
    %% CAMADA DE VIEW (UI)
    %% ==========================================
    namespace View {
        class Screen {
            <<abstract>>
            +render()
        }
        class LoginScreen
        class FeedScreen
        class NavigationManager
    }

    LoginScreen --|> Screen
    FeedScreen --|> Screen

    %% ==========================================
    %% CAMADA DE CONTROLLER
    %% ==========================================
    namespace Controller {
        class AuthController {
            +login(user, pass) ControllerResult
            +register(user, pass) ControllerResult
        }
        class PostController {
            +createPost(content) ControllerResult
        }
        class ControllerResult~T~ {
            <<sealed interface>>
        }
    }

    LoginScreen --> AuthController : Chama
    FeedScreen --> PostController : Chama
    AuthController ..> ControllerResult : Retorna
    PostController ..> ControllerResult : Retorna

    %% ==========================================
    %% CAMADA DE APLICAÇÃO (SERVICES)
    %% ==========================================
    namespace Application {
        class AuthService {
            +login(username, rawPassword) AuthResult
        }
        class UserService {
            +register(username, rawPassword) User
        }
        class PostService {
            +createPost(userId, content) Post
        }
        class SessionManager {
            +require() User
            +login(User)
        }
        class PasswordHasher {
            <<interface>>
            +hash(rawPassword) String
            +matches(rawPassword, hash) boolean
        }
        class TokenProvider {
            <<interface>>
            +generate(userId) String
        }
    }

    AuthController --> AuthService : Orquestra
    AuthController --> UserService : Orquestra
    PostController --> PostService : Orquestra
    PostController --> SessionManager : Verifica Sessão

    %% ==========================================
    %% CAMADA DE DOMÍNIO (NÚCLEO)
    %% ==========================================
    namespace Domain {
        class User {
            -UUID userId
            -String username
            -String passwordHash
        }
        class Post {
            -UUID postId
            -String content
            +assertDeletableBy(User)
        }
        class UserRepository {
            <<interface>>
            +findByUsername(username) Optional~User~
            +save(User)
        }
        class PostRepository {
            <<interface>>
            +save(Post)
        }
    }

    AuthService --> UserRepository : Usa
    AuthService --> PasswordHasher : Delega (Strategy)
    AuthService --> TokenProvider : Usa
    
    UserService --> UserRepository : Usa
    UserService --> PasswordHasher : Delega
    UserService ..> User : Cria

    PostService --> PostRepository : Usa
    PostService ..> Post : Cria

    %% ==========================================
    %% CAMADA DE INFRAESTRUTURA
    %% ==========================================
    namespace Infrastructure {
        class JsonUserRepository
        class JsonPostRepository
        class BCryptPasswordHasher
        class JwtTokenProvider
    }

    %% Inversão de Dependência: A infraestrutura implementa as interfaces
    JsonUserRepository ..|> UserRepository : Implementa
    JsonPostRepository ..|> PostRepository : Implementa
    BCryptPasswordHasher ..|> PasswordHasher : Implementa
    JwtTokenProvider ..|> TokenProvider : Implementa
