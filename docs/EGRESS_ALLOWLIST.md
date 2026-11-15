# 公式サイト確認のための外向き通信 許可リスト

## なぜ必要か
Claude Code on the web の実行環境は、外向き通信がネットワークポリシーで制限されています。
そのため、価格の出典URL（公式サイト）のほとんどに接続できず、公式ページでの価格確認ができません。
（2026-10-11 の検証: 145件中、接続できたのは claude.com のみ）

## やること（オーナー）
1. Claude Code on the web の「環境（Environment）」設定を開く
2. ネットワークアクセスの許可ドメイン（Allowed domains）に、下のドメインを追加する
   （「Custom」で許可リストを選び、貼り付ける。設定画面の名称は変更されることがあります）
3. 次回のセッションで「`node scripts/verify-sources.mjs` を実行して公式価格を確認して」と依頼する

詳しくは公式ドキュメント https://code.claude.com/docs/en/claude-code-on-the-web を参照してください。

## 追加するドメイン（143件）
```
airtable.com
asana.com
aws.amazon.com
bolt.new
boomy.com
brainly.com
character.ai
chat.qwen.ai
clickup.com
clipdrop.co
coda.io
consensus.app
creator.nightcafe.studio
designs.ai
devin.ai
docs.sudowrite.com
elai.io
elevenlabs.io
elicit.com
fireflies.ai
gamma.app
gemini.google
get.mem.ai
github.com
grain.com
help.openai.com
ideogram.ai
inkforall.com
invideo.io
kling.ai
krisp.ai
leonardo.ai
looka.com
lovable.dev
lovo.ai
lumalabs.ai
meetgeek.ai
miro.com
mistral.ai
monday.com
murf.ai
one.google.com
openai.com
otter.ai
pieces.app
pika.art
pitch.com
play.ht
playgroundai.com
plusai.com
podcast.adobe.com
podcastle.ai
poe.com
prezi.com
quillbot.com
quizlet.com
reclaim.ai
refact.ai
replika.com
replit.com
runwayml.com
rytr.me
scispace.com
simplified.com
slack.com
sonix.ai
speechify.com
studyfetch.com
suno.com
support.google.com
surferseo.com
tldv.io
tome.app
trint.com
uizard.io
verbit.ai
vercel.com
wellsaidlabs.com
windsurf.com
writesonic.com
www.adobe.com
www.anyword.com
www.artbreeder.com
www.avoma.com
www.beautiful.ai
www.blackbox.ai
www.canva.com
www.capcut.com
www.chai-ai.com
www.chegg.com
www.colossyan.com
www.copy.ai
www.copysmith.ai
www.coursehero.com
www.coursera.org
www.coze.com
www.cursor.com
www.d-id.com
www.descript.com
www.doubao.com
www.fathom.ai
www.fotor.com
www.framer.com
www.frase.io
www.freepik.com
www.genspark.ai
www.grammarly.com
www.heygen.com
www.jasper.ai
www.jetbrains.com
www.khanmigo.ai
www.kimi.com
www.krea.ai
www.lalal.ai
www.meta.com
www.microsoft.com
www.midjourney.com
www.notion.com
www.notta.ai
www.perplexity.ai
www.photoroom.com
www.recraft.ai
www.rev.com
www.scholarcy.com
www.semrush.com
www.slidesai.io
www.supernormal.com
www.synthesia.io
www.talkie-ai.com
www.todoist.com
www.udio.com
www.usemotion.com
www.vidu.com
www.visme.co
www.voicemod.net
www.warp.dev
www.wolframalpha.com
www.wordtune.com
www.zoom.com
x.ai
xinghuo.xfyun.cn
you.com
zhujiao.chatglm.cn
```

## 確認後に行うこと
- `node scripts/verify-sources.mjs` で掲載価格が公式ページに現れるかを一括確認する
- 「要確認」と出たプランは、公式ページを開いて価格・プラン名を直し、`checkedAt` を更新する
- 画面操作が必要な料金ページ（JavaScriptで表示されるもの）は取得できないことがあるため、その場合は目視確認する
