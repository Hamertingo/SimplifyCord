# SimplifyCord

Uma estrutura simplificada para criar bots Discord usando TypeScript, focando em uma experiência de desenvolvimento mais limpa e intuitiva.

## 🚀 Características

- ✨ Sistema de comandos simplificado
- 🎮 Gerenciamento fácil de interações
- 🛠️ Componentes pré-construídos (Embeds, Modais, Rows)
- 📦 Importação automática de comandos e eventos
- 🔧 Configuração simplificada

## 📋 Pré-requisitos

- Node.js (versão 16.x ou superior)
- TypeScript
- Discord.js

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [seu-repositorio]
```

2. Instale as dependências:
```bash
npm install
```

3. Configure seu bot no arquivo `src/index.ts`:

```typescript
new bootstrapApp({ 
    // Importação automática de arquivos
    autoImport: ["src/commands", "src/events"],
    
    // Token do bot
    token: "TOKEN_AQUI",
    
    // Ativa logs detalhados
    loadLogs: true,
    
    // Configuração de comandos
    commands: {
        // Registra comandos apenas em servidores específicos
        guilds: ["ID_DO_SERVIDOR_1", "ID_DO_SERVIDOR_2", "ID_DO_SERVIDOR_3"],
        
        // Ou registra globalmente (não especifique guilds)
    }
})
```

## 📚 Guia de Uso

### 🤖 Slash Commands

Crie comandos slash com facilidade:

```typescript
import { SlashCommand } from "simplifycord"; 
import { ApplicationCommandType } from "discord.js";

new SlashCommand({
    name: "ping",
    description: "Pong",
    type: ApplicationCommandType.ChatInput,
    run: async (_client, interaction) => {
        await interaction.reply({
            content: "Comando de teste",
            ephemeral: true
        });
    }
})
```

### 🎛️ Componentes

#### Criando Botões
```typescript
import { CreateRow } from "simplifycord";
import { ButtonBuilder } from "discord.js";

const buttons = CreateRow([
    new ButtonBuilder({
        customId: `test-button/accept`,
        label: "Aceitar",
        style: 1
    }),
    new ButtonBuilder({
        customId: `test-button/decline`,
        label: "Recusar",
        style: 4
    })
])
```

#### Criando Embeds
```typescript
import { CreateEmbed } from "simplifycord";

const embed = CreateEmbed({
    title: "Título do Embed",
    description: "Descrição do embed",
    // Campos opcionais
    color: 0x0099FF,
    footer: { text: "Rodapé do embed" }
})
```

#### Criando Modais
```typescript
import { CreateModal } from "simplifycord";
import { TextInputStyle } from "discord.js";

const modal = CreateModal({
    title: "Título do Modal",
    customId: "modal-id",
    inputs: [
        {
            label: "Campo de texto",
            customId: "input-id",
            style: TextInputStyle.Short
        }
    ]
})
```

### 🎯 Sistema de Interações

#### Manipulador de Interações Básico
```typescript
import { InteractionHandler } from "simplifycord";
import { InteractionType } from "simplifycord";

new InteractionHandler({
    customId: "test-button",
    type: InteractionType.Button,
    run: async (_client, interaction) => {
        await interaction.reply({
            content: "Botão clicado!",
            ephemeral: true
        });
    }
})
```

#### Sistema de Parâmetros em Interações
```typescript
// Botão com parâmetros
new ButtonBuilder({
    customId: `button/:userId/:action`,
    label: "Botão com Parâmetros"
})

// Manipulador com parâmetros
new InteractionHandler({
    customId: "button/:userId/:action",
    type: InteractionType.Button,
    run: async (_client, interaction, { userId, action }) => {
        await interaction.reply({
            content: `Usuário: ${userId}, Ação: ${action}`,
            ephemeral: true
        });
    }
})
```

### 📡 Eventos

Crie listeners para eventos do Discord:

```typescript
import { Event } from "simplifycord";

new Event({
    name: "Ready Event",
    event: "ready",
    async run() {
        console.log(`Bot online como ${client.user.tag}!`);
    }
})
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. Reportar bugs
2. Sugerir novas features
3. Criar pull requests

## 📝 Licença

Este projeto está sob a licença ISC - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Autor

* **Hamerti** - [GitHub](https://github.com/Hamerti)