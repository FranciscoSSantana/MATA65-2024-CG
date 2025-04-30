
# Relatório da Atividade Unidade I - Logotipo Animado - Francisco Santana - 222216228

## Parte 1 - Cenário Dinâmico:

Para a criação da production logo, primeiramente escolhi um nome. De forma simples, escolhi "xico" para ser o nome da marco pois é como muitos amigos me chamam.

Quanto a animação da logo, de cara me inspirei na logo da Roku, que também é composta por 4 letras e cada uma é deformada de forma única.

Logo, dividi o trabalho em 5 etapas:

1. Primeiramente, defini um gradiente simples baseado na posição z do vértice para colorir a logo no Fragment Shader.

2. Definida a palavra e cor, trabalhei na deformação de cada uma das letras através do Vertex Shader.
    1. O "x" sofre uma deformação com tappering.
    2. O "i" sofre uma deformação com squish & stretch.
    3. O "c" sofre uma deformação com bending.
    4. O "o" sofre uma deformação com twist.

3. Depois de definidas as deformações, trabalhei no movimento individual das letras e determinei que seria um "passo à frente" de cada para demonstrar as respectivas deformações.

4. Após isso, defini o movimento em conjunto da palavra. Também inspirado na logo da Roku, decidi que a palavra daria um pulo, ativando a deformação de cada uma das letras ao aterrissar.

5. Por fim, demarquei o tempo de duração de cada uma das animações de forma que ela fosse executada em loop.

Assim, a logomarca tem uma animação que dura cerca de 14 segundos, reiniciando automaticamente ao fim do ciclo.

## Parte 2 - Câmera Dinâmica:

Para a adição da câmera dinâmica, utilizei uma curva criada a partir de alguns pontos de controle através da classe `CatmullRomCurve3` do `three.js`. Além disso, defini três focos na logomarca para que a câmera fosse direcionada ao longo da trajetória, sendo feita uma transição entre eles interpolando as posições de acordo com o tempo passado desde o início do movimento da câmera.

Dessa forma, construi o _flythrough_ da câmera de forma que ele dure exatamente um ciclo da animação, retornando à posicão inicial ao mesmo tempo em que a animação acaba e logo depois iniciando novamente junto com a mesma.

Para a visualização _Picture-in-Picture_, posicionei outra câmera numa posição afastada, em que fosse possível visualizar tanto a _production logo_ quanto a câmera principal. Assim, renderizei a visão da segunda câmera com o `CameraHelper` da primeira câmera ligado, para que fosse possível acompanhar seu movimento.

Apesar de alguma dificuldade inicialmente com a renderização, depois de algumas pesquisas foi possível realizá-la sem maiores problemas.