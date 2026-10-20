# Fotos de produtos e novo cadastro

## Configuração única no Supabase

Execute **docs/product-images.sql** no SQL Editor do mesmo projeto do site.
Essa configuração é adicional às regras de produtos aplicadas anteriormente.
Ela cria o bucket público `product-images` e permite envio/remoção de fotos somente a administradores não anônimos, em sua própria pasta. As fotos do catálogo são públicas por intenção; não envie receitas ou documentos de clientes para esse bucket.

Não foi possível aplicar ou testar essa configuração no projeto remoto nesta sessão, pois não há conexão administrativa disponível.

## Funcionamento

- `#/admin/dashboard` é a página inicial após o login.
- Novos cadastros começam em branco. Editar preserva os dados reais existentes.
- Escolha de 1 a 8 fotos JPG, PNG ou WebP, de até 8 MB por arquivo.
- O navegador prepara cópias WebP com até 1600 pixels no maior lado, com compressão progressiva buscando até 350 KB por foto.
- Escolha a capa usando a ação abaixo de uma miniatura.
- As fotos só são enviadas ao clicar em **Salvar produto**.
- Se um envio ou o salvamento falhar, a tela mantém o formulário e as fotos para tentar novamente.
- Fotos enviadas nessa tentativa e ainda não publicadas são removidas em caso de falha. Uma falha de conexão também pode impedir essa limpeza; o administrador pode revisar arquivos órfãos no Storage depois.
- A remoção de uma foto de um produto existente altera a galeria ao salvar, sem excluir automaticamente o arquivo antigo do armazenamento.
- Não há preenchimento automático de textos, medidas, promoções, avaliações ou itens inclusos.
- Preço anterior e desconto Pix são opcionais: sem preenchimento, o preço anterior é igual ao atual e o desconto é zero.
- A prévia usa `ProductDetailView`, cabeçalho, rodapé e configurador reais dentro de um quadro com viewport próprio.
- Na prévia, navegação externa e envio ao WhatsApp não são realizados.
- Edições não salvas ficam nesta tela; sair exige confirmação por links do painel e ao fechar/recarregar.

## Validação após configurar

1. Entre como administrador e crie um produto com uma foto importada.
2. Confirme que a foto aparece no Storage e na página pública em outro navegador.
3. Teste várias fotos, troca de capa, edição e remoção de foto da galeria.
4. Teste arquivo inválido ou maior que 8 MB.
5. Confirme que usuário comum e visitante não conseguem enviar arquivos.
6. Confira a prévia no celular e no computador, incluindo galeria, abas e escolha de lentes.

Testes locais: `npm run test:admin` e `node --experimental-vm-modules tests/product-creation.test.mjs`.


## Editor e prévia

O topo permanece fixo com as etapas, a ação Próximo/Salvar, progresso de importação e os erros. Campos obrigatórios e opcionais têm identificação e ajuda. Os erros levam ao campo correspondente. A compressão acontece antes de qualquer envio, e o editor mostra o tamanho original, o tamanho WebP e a economia obtida.

As miniaturas abrem um modal dedicado. A prévia de computador mantém um viewport de 1440 × 900 e a de celular usa 390 × 844. A escala se ajusta ao espaço disponível sem trocar os pontos de quebra do layout. O modal pode ocupar toda a janela, contém o foco, fecha com Escape e devolve o foco à miniatura. A meta de 350 KB depende do conteúdo da imagem; somente a versão otimizada é enviada ao Storage.
