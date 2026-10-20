# Acesso administrativo da Óticas Aion

## Implementado no site

- Entrada apenas por login, sem chamadas de cadastro.
- Painel permitido somente para usuários não anônimos com `app_metadata.role = "admin"`.
- Validação da conta com `auth.getUser()` ao abrir o painel e antes de salvar ou excluir.
- Salvamento e exclusão só atualizam o cache após confirmação do banco.
- Páginas distintas: `#/admin/login`, `#/admin/produtos`, `#/admin/produtos/novo`, `#/admin/produtos/ID/editar` e `#/admin/acesso`.
- O endereço utiliza hash para funcionar no GitHub Pages, inclusive ao recarregar ou usar Voltar.

## Configuração obrigatória no Supabase hospedado

**Estas configurações não foram aplicadas remotamente nesta sessão.** A chave pública do site não permite administrar o projeto. Até concluir estes passos, remover o cadastro da interface não bloqueia a API de cadastro e as políticas antigas do banco podem continuar permitindo gravação.

1. No projeto correto, abra Authentication → Sign In / Providers. Desative **Allow new users to sign up** e **Allow anonymous sign-ins**. Mantenha login por e-mail/senha disponível.
2. Escolha as contas administrativas existentes com o responsável pela loja. Crie novas contas exclusivamente pelo Dashboard/Admin API, quando necessário. Não promova todas as contas existentes automaticamente.
3. Atribua `{"role":"admin"}` em **app_metadata**, preservando os demais campos. Use uma operação administrativa confiável, como `auth.admin.updateUserById(userId, { app_metadata: { ...existingAppMetadata, role: 'admin' } })`. Nunca use `user_metadata` ou uma chave administrativa no navegador.
4. Revise e execute `docs/admin-access.sql` no SQL Editor. O script mantém leitura pública e exige a mesma permissão administrativa para inserir, atualizar e excluir. Inclui políticas restritivas para impedir que outra política permissiva libere alterações a contas comuns.
5. Saia e entre novamente para renovar as permissões no token. Ao revogar uma permissão, revogue também as sessões; tokens emitidos anteriormente podem continuar válidos até expirar.
6. Confira os Security Advisors do Supabase após aplicar.

## Verificação remota obrigatória

Em um produto de teste, confirme:

| Identidade | Consultar catálogo | Inserir / atualizar / excluir |
| --- | --- | --- |
| Visitante sem sessão | Permitido | Negado |
| Usuário comum, inclusive com role em user_metadata | Permitido | Negado |
| Administrador não anônimo com role em app_metadata | Permitido | Permitido |
| Sessão expirada | Permitido como visitante | Negado |

Verifique o conteúdo antes/depois; uma atualização ou exclusão negada por RLS pode retornar zero registros sem erro. O serviço do site trata esse caso como falha.

Teste também que a API de cadastro rejeita uma tentativa após desativar novos usuários, sem usar dados reais desnecessariamente.

## Páginas públicas

- `#/`: início e seleção de modelos.
- `#/catalogo`: catálogo completo.
- `#/produto?id=ID`: detalhes do produto.
- `#/como-funciona`: compra e envio da receita.
- `#/por-que-aion`: diferenciais e depoimentos.
- `#/duvidas`: perguntas frequentes.
- `#/politicas`: termos, privacidade e garantias.

Links antigos como `#catalogo`, `#produto?id=ID`, `#como-funciona` e `#admin` continuam reconhecidos.

## Referências

- [Configuração de autenticação](https://supabase.com/docs/guides/auth/general-configuration)
- [Segurança por linha](https://supabase.com/docs/guides/database/postgres/row-level-security)
