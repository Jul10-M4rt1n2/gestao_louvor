# Gestão Louvor - Sistema de Gerenciamento de Ministérios de Louvor

![Laravel](https://img.shields.io/badge/Laravel-12-red)
![React](https://img.shields.io/badge/React-18-blue)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-teal)

Sistema completo para gestão de ministérios de louvor em igrejas, desenvolvido com Laravel + React + Inertia.js seguindo arquitetura SOLID rigorosa.

## ✨ Funcionalidades

### 🎵 Gestão de Músicas
- **CRUD Completo**: Cadastro, edição, visualização e exclusão de músicas
- **Transposição de Cifras**: Algoritmo completo de transposição para qualquer tonalidade
- **Upload de Arquivos**: Suporte para PDF e DOCX com extração automática de texto
- **Busca Avançada**: Full-text search por título, artista e gênero
- **Dicionário de Acordes**: Referência completa com diagramas para violão e teclado
- **Afinador**: Afinador cromático usando Web Audio API

### 👥 Gestão de Grupos
- **Grupos e Ministérios**: Organização hierárquica de grupos por ministérios
- **Membros**: Atribuição de membros a grupos com funções específicas
- **Escalas**: Criação e gerenciamento de escalas/agendamentos
- **Participantes**: Convites e confirmação de participantes por escala

### 💬 Chat em Tempo Real
- **Chat Geral**: Comunicação da organização
- **Chat por Grupo**: Mensagens específicas por grupo
- **Tipos de Mensagem**: Texto, arquivos e imagens
- **Broadcasting**: Laravel Echo + Pusher/Reverb

### 🔐 Controle de Acesso
- **Roles**: Admin, Líder, Músico, Visitante
- **Políticas**: Authorization policies para cada recurso
- **Multi-organização**: Isolamento de dados por organização

## 🛠️ Stack Tecnológico

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18 + Inertia.js 2.0
- **Styling**: TailwindCSS 4.0, Headless UI
- **Database**: MySQL/PostgreSQL com Full-Text Search
- **Auth**: Laravel Sanctum
- **Real-time**: Laravel Echo + Pusher
- **PDF Parsing**: smalot/pdfparser
- **DOCX Parsing**: phpoffice/phpword

## 📁 Arquitetura SOLID

```
app/
├── Domain/               # Camada de Domínio (DTOs, Enums, ValueObjects)
│   ├── Music/
│   │   ├── DTOs/
│   │   ├── Enums/       ✅ Key, ChordType, InstrumentType
│   │   └── ValueObjects/
│   ├── Group/
│   ├── Chat/
│   └── User/
│       └── Enums/       ✅ UserRole
│
├── Services/            # Lógica de Negócio
│   ├── Music/
│   │   ├── MusicService
│   │   ├── ChordTranspositionService
│   │   ├── ChordDictionaryService
│   │   ├── FileParserService
│   │   └── TunerService
│   ├── Group/
│   ├── Chat/
│   └── Notification/
│
├── Repositories/        # Abstração de Persistência
│   ├── Contracts/      # Interfaces
│   └── Eloquent/       # Implementações
│
├── Actions/            # Single Responsibility Actions
│   ├── Music/
│   │   ├── TransposeChordAction
│   │   ├── ExtractTextFromPdfAction
│   │   ├── ExtractTextFromDocxAction
│   │   ├── ParseChordsAction
│   │   └── GenerateChordDiagramAction
│   ├── Group/
│   └── Chat/
│
├── Http/
│   ├── Controllers/
│   ├── Requests/       # Form Validation
│   ├── Resources/      # API Resources
│   ├── Middleware/
│   └── Policies/       # Authorization
│
└── Models/             ✅ Music, Role, ChatMessage, ScheduleMusic
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- PHP 8.2 ou superior
- Composer
- Node.js 18+ e NPM
- MySQL 8.0+ ou PostgreSQL 13+
- Redis (opcional, para cache e queues)

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone https://github.com/Jul10-M4rt1n2/gestao_louvor.git
cd gestao_louvor
```

2. **Instale as dependências**
```bash
composer install
npm install
```

3. **Configure o ambiente**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure o banco de dados no .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestao_louvor
DB_USERNAME=root
DB_PASSWORD=

# Broadcasting (Pusher ou Laravel Reverb)
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-app-key
PUSHER_APP_SECRET=your-app-secret
PUSHER_APP_CLUSTER=mt1
```

5. **Execute as migrations e seeders**
```bash
php artisan migrate
php artisan db:seed --class=RoleSeeder
```

6. **Compile os assets**
```bash
npm run build  # Produção
npm run dev    # Desenvolvimento
```

7. **Inicie o servidor**
```bash
php artisan serve
```

Acesse: http://localhost:8000

## 📊 Banco de Dados

### Migrations Implementadas ✅

- ✅ `organizations` - Organizações/Igrejas
- ✅ `users` - Usuários do sistema
- ✅ `ministries` - Ministérios
- ✅ `groups` - Grupos de louvor
- ✅ `ministry_functions` - Funções (Vocal, Guitarra, etc.)
- ✅ `user_groups` - Pivot: Usuários <-> Grupos
- ✅ `user_functions` - Pivot: Usuários <-> Funções <-> Grupos
- ✅ `schedules` - Escalas/Agendamentos
- ✅ `schedule_participants` - Participantes de escalas
- ✅ `roles` e `user_roles` - Sistema de permissões
- ✅ `musics` - Músicas com cifras
- ✅ `schedule_musics` - Músicas vinculadas a escalas
- ✅ `chat_messages` - Mensagens de chat
- ✅ `notifications` - Notificações do sistema

### Models Implementados ✅

- ✅ Organization, User, Ministry, Group, MinistryFunction
- ✅ Schedule, ScheduleParticipant
- ✅ Music, ScheduleMusic
- ✅ Role, ChatMessage

## 🎯 Status de Implementação

### ✅ Completo
- [x] Estrutura de banco de dados (migrations)
- [x] Models com relacionamentos
- [x] Enums do domínio (Key, ChordType, InstrumentType, UserRole)
- [x] RoleSeeder
- [x] Instalação de dependências (Composer e NPM)
- [x] Middleware Inertia.js

### 🚧 Em Desenvolvimento

#### Próximos Passos Críticos

1. **Domain Layer (DTOs e ValueObjects)**
   - [ ] MusicData, ChordData, TranspositionData DTOs
   - [ ] Chord e ChordProgression ValueObjects
   - [ ] Outros DTOs para Group, Chat, User

2. **Services Layer**
   - [ ] MusicService (CRUD)
   - [ ] ChordTranspositionService (algoritmo completo)
   - [ ] ChordDictionaryService (banco de diagramas)
   - [ ] FileParserService (PDF + DOCX extraction)
   - [ ] TunerService (cálculo de frequências)
   - [ ] GroupService, ScaleService, ChatService

3. **Actions Layer**
   - [ ] TransposeChordAction
   - [ ] ExtractTextFromPdfAction, ExtractTextFromDocxAction
   - [ ] ParseChordsAction
   - [ ] GenerateChordDiagramAction
   - [ ] CreateScaleAction, AssignMemberAction
   - [ ] SendMessageAction

4. **HTTP Layer**
   - [ ] Controllers (Music, Group, Scale, Chat, Auth, Tuner, ChordDictionary)
   - [ ] Form Requests (validação)
   - [ ] API Resources (serialização)
   - [ ] Policies (autorização)
   - [ ] CheckRole Middleware

5. **Repository Layer**
   - [ ] Repository Interfaces
   - [ ] Eloquent Implementations
   - [ ] RepositoryServiceProvider

6. **Frontend React + Inertia**
   - [ ] Setup Vite + Inertia + React
   - [ ] Layouts (AppLayout, GuestLayout)
   - [ ] Auth Pages (Login, Register, Forgot Password)
   - [ ] Dashboard
   - [ ] Music Pages (Index, Show, Edit, ChordDictionary, Tuner)
   - [ ] Music Components (MusicPlayer, ChordDisplay, ChordDiagram, KeySelector, TunerCanvas)
   - [ ] Group Pages (Index, Show, Chat)
   - [ ] Scale Pages (Index, Editor)
   - [ ] Chat Components (ChatBox, MessageItem)
   - [ ] Common Components (Button, Input, Modal, FileUpload, Notification)
   - [ ] Hooks (useMusic, useTransposition, useChat, useTuner, useNotifications)
   - [ ] Utils (chordTransposer.js, chordParser.js, audioProcessor.js, musicalTheory.js)

7. **Events & Broadcasting**
   - [ ] MessageSent Event
   - [ ] Configuração Laravel Echo + Pusher/Reverb

8. **Routes**
   - [ ] Definir todas as rotas web.php
   - [ ] Integrar controllers com Inertia

9. **Seeders**
   - [x] RoleSeeder
   - [ ] ChordSeeder (diagramas de acordes)

10. **Tests**
    - [ ] Unit Tests (Services, Actions, Utils)
    - [ ] Feature Tests (CRUD, Auth, File Upload, Transposition)

## 🎼 Funcionalidades Musicais Especiais

### Transposição de Cifras

O sistema implementa um algoritmo completo de transposição que:
- Reconhece todos os tipos de acordes (maiores, menores, 7, maj7, m7, dim, aug, sus2, sus4, etc.)
- Preserva baixos (ex: C/E → D/F#)
- Suporta sustenidos (#) e bemóis (b)
- Transpõe por intervalos de semitons

### Afinador Cromático

Usando Web Audio API:
- Acesso ao microfone via `getUserMedia`
- Análise de frequência com `AnalyserNode`
- Algoritmo de autocorrelação para detecção de pitch
- Display visual com ponteiro/gauge
- Cores indicativas: vermelho (longe), amarelo (próximo), verde (afinado)

### Dicionário de Acordes

Banco de dados com:
- Diagramas SVG responsivos
- Violão: posições, pestanas, cordas abertas/abafadas
- Teclado: teclas destacadas
- 50+ acordes comuns por tonalidade

## 📝 Scripts Úteis

```bash
# Setup completo
composer setup

# Desenvolvimento (servidor + queue + logs + vite)
composer dev

# Testes
composer test
php artisan test

# Linter (Laravel Pint)
./vendor/bin/pint

# Migrations
php artisan migrate
php artisan migrate:fresh --seed

# Build assets
npm run build
npm run dev
```

## 🔒 Segurança

- Autenticação Laravel Sanctum
- CSRF Protection
- XSS Prevention
- SQL Injection Protection via Eloquent ORM
- Authorization Policies
- Roles e Permissions

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Jul10-M4rt1n2**

- GitHub: [@Jul10-M4rt1n2](https://github.com/Jul10-M4rt1n2)

## 🙏 Agradecimentos

- Laravel Framework
- React Team
- Inertia.js
- TailwindCSS
- Comunidade Open Source

---

**Status do Projeto**: 🚧 Em Desenvolvimento Ativo

**Última Atualização**: Fevereiro 2026

