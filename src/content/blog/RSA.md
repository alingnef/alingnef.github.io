---
title: "RSA"
description: "Vì sao RSA là thuật toán mã hóa bất đối xứng được tin dùng ngày nay."
pubDate: 2026-08-30
tags: ["CTF", "write-up", "workflow"]
---

# Hệ mật khóa bất đối xứng RSA
Trong mật mã học, **RSA** là một thuật toán mật mã hóa khóa công khai. Đây là thuật toán đầu tiên phù hợp với việc tạo ra chữ ký điện tử đồng thời với việc mã hóa. Nó đánh dấu một sự tiến bộ vượt bậc của lĩnh vực mật mã học trong việc sử dụng khóa công khai. RSA đang được sử dụng phổ biến trong thương mại điện tử và được cho là đảm bảo an toàn với điều kiện độ dài khóa đủ lớn.

Hệ mã RSA được giới thiệu vào năm 1977 bởi 3 nhà khoa học **Ron Rivest, Adi Shamir, Len Adlerman**. Đây là một trong những hệ mã được sử dụng phổ biến nhất hiện nay, ứng dụng cho truyền dữ liệu an toàn qua internet, email. RSA còn là nền tảng mật mã cho các giao thức SSL/TLS, SET, SSH, PGP, … RSA cũng được ứng dụng trong chữ ký số (Digital Signature).

**1. Nguyên lý hoạt động của RSA dựa trên số học Modulo, cụ thể theo các bước sau :** 
- Chọn 2 số nguyên tố lớn $p, q$ với $p \neq q$, chọn hoàn toàn ngẫu nhiên.
- Tính $N = p.q$
- Tính hàm Euler $\phi(N) = N.(1-\frac{1}{p}).(1-\frac{1}{q})$
- Chọn một số tự nhiên $e$ sao cho $1 < e < \phi(N)$ và $gcd(e, \phi(N)) = 1$
- Tìm $d$ sao cho $e.d \equiv 1 \pmod{\phi(N)}$

Khi này ta có 2 cặp khóa bí mật và công khai :
- Khóa bí mật : $(N, d)$
- Khóa công khai : $(N, e)$

Giả sử ai đó có một văn bản **plaintext (pt)** cần được mã hóa thành **ciphertext (ct)** để gửi cho bạn : 
- Bước 1 : Họ phải chuyển đổi đoạn văn bản đó sang toàn là số trước, gọi là $m$.
- Bước 2 : Họ sẽ sử dụng khóa công khai $(N, e)$ của bạn để mã hóa văn bản đó với công thức :

$$
c \equiv m^{e} \pmod{N} 
$$
> Khi này $c$ sẽ là đoạn văn bản đã được mã hóa dưới dạng số. Đôi khi cũng hay xài kí hiệu $ct$.

Và khi họ gửi $c$ cho chúng ta thì ta sẽ dùng khóa bí mật $(N, d)$ của bản thân để giải mã theo công thức : 

$$m \equiv c^{d} \pmod{N}$$
> Đôi khi cũng thay $m$ bằng kí hiệu $pt$ chỉ văn bản gốc (plaintext).

Ví dụ : 
- Bob muốn gửi tin nhắn là "Hello Alice!" tới cô bạn Alice của mình và anh ấy không muốn ai biết được nội dung tin nhắn. Tình cờ thay, Bob mới học được cách mã hóa tin nhắn bằng mật mã RSA, và anh biết được Alice cũng đang sử dụng mật mã RSA.

- Đầu tiên, anh sẽ chuyển hóa tin nhắn của mình thành dạng số, sau đó sẽ sử dụng khóa công khai $(N, e)$ của Alice để mã hóa theo công thức : $c \equiv m^{e} \pmod{N}$.
> Trong ví dụ này ta lấy $(N, e) = (589366878063882472795253646368442094378501217, 65537)$

- Khi này, Alice sẽ nhận được một chuỗi số $c$ từ người bạn Bob của mình. Cô đoán là Bob đã sử dụng khóa công khai của cô để mã hóa tin nhắn và gửi cho mình. Lúc này, Alice sẽ sử dụng khóa bí mật $(N, d)$ của bản thân để giải mã theo công thức : $m \equiv c^{d} \pmod{N}$
> Ta có : $N = 589366878063882472795253646368442094378501217 = 31008534136543705961237 \times 19006602358842586656541$
> 
> Khi này dễ dàng tính được : $\phi(N) = 589366878063882472795203631231946708085883440$
> 
> Và $d = 358051821873346058781162283557379162647656273$

- Sau khi giải mã, Alice sẽ biết được nội dụng mà Bob gửi cho cô và cô có thể trả lời lại.
![image](https://hackmd.io/_uploads/SJPFEzENye.png)



- Code minh họa toàn bộ quá trình mã hóa và giải mã :
```python
from Crypto.Util.number import *
from sympy import *

m = bytes_to_long(b'Hello Alice!') #chuyển từ văn bản cần gửi sang số.

p = 19006602358842586656541 #N phân tích thành p.q
q = 31008534136543705961237

e = 65537 #Một số e nào đó thỏa tính chất đã nêu

phi = (p-1)*(q-1) #Khi có được p,q thì dễ dàng tính được phi

d = pow(e, -1, phi) #Có phi là tính được khóa bí mật d

c = pow(m, e, p*q) #Bắt đầu mã hóa 
print(c) 
#Output : c = 530716430372850493310706567122791003740150567

print(long_to_bytes(pow(c, d, p*q)).decode())  #Giải mã về văn bản ban đầu 
#Output : Hello Alice!
```

Độ mạnh của hệ mã RSA dựa trên việc bạn cần phân tích được $N$ ra thừa số nguyên tố để tính $d$ nếu muốn phá mã, và đến nay chưa có giải thuật nào hiệu quả trong thời gian đa thức giúp ta phân tích thừa số nguyên tố đối với các số lớn.

Hệ mã RSA nếu được thiết kế một cách đúng đắn với việc chọn các tham số $n, p, q, e$ hợp lý thì sẽ rất an toàn, thế nhưng trong các bài CTF, các tham số này thường được chọn theo một cách nào đó khiến cho hệ mã yếu đi và dễ bị tấn công. Các điểm yếu thực thi của RSA sẽ được trình bày dưới đây, là một vài kiểu tấn công RSA phổ biến.







# Các kiểu tấn công RSA thường gặp 
## Factorizing the public key
- Cái khó của RSA nằm ở việc phân tích khóa công khai $N = p.q$. Khi có được $p, q$ là sẽ có tất cả như $\phi(N), d$, từ đó dễ dàng giải mã được tin nhắn.

- Nếu $N$ nhỏ (chiều dài $N < 256 bit$), ta có thể dễ dàng phân tích $N = p.q$ bằng cách brute-force số $p$. Chiều dài $N$ được khuyến cáo là $1024 bit$.

- Kể cả khi $N$ lớn, đôi khi phân tích của $N$ đã có sẵn trong các database online như [factordb](https://factordb.com/index.php). Hoặc dễ dàng phân tích bằng các công cụ online như [alpertron](https://www.alpertron.com.ar), trang web này sử dụng phương pháp Elliptic Curve Method để phân tích. Vậy nên, việc đầu tiên bạn cần làm khi gặp các bài RSA là thử các trang web này trước để kiểm tra.

- Để phân tích $N$ ta có thể thử dùng hàm `factorint()` trong thư viện `sympy` 
Ví dụ code : 
```python
from sympy import *

n = 589366878063882472795253646368442094378501217

factor = factorint(n)

print(factor)
#Output : {mpz(19006602358842586656541): 1, 31008534136543705961237: 1}
```

- Như đã nói, với các số $N$ nhỏ dưới 256 bits thì máy tính vẫn có thể phân tích được. Thế nhưng chắc chắn người ta sẽ không bao giờ lấy một số nhỏ như vậy để mã hóa mà sẽ lấy một số rất lớn khoảng $1024 bit$ hoặc $2048 bit$. Khi này máy tính sẽ mất rất nhiều thời gian để phân tích, thậm chí là không thể phân tích được. Đó là lý do vì sao nên chọn $p, q$ đủ lớn để tạo thành $N$ lớn khiến kẻ tấn công khó phân tích được. Tuy nhiên vẫn sẽ còn lỗ hỏng và nó ở dưới :-1: 



## Multi-prime RSA
Chúng ta đã biết được các mà RSA hoạt động như thế nào. Bằng việc chọn ra 2 số nguyên có độ lớn như **1024 bits, 2048 bits,...** là ta đã có thể tạo ra được một hệ thống RSA không thể bị phá vỡ (tất nhiên cũng phải chọn đúng số mũ **e**).

Nhưng bạn có biết rằng về mặt lý thuyết, có thể sử dụng nhiều hơn 2 số nguyên tố để tạo cặp khóa không?. Khi đó ta sẽ có công thức như sau :

$$n = \prod_{i=1}^{k} p_i$$

$$\Rightarrow \varphi(n) = \prod_{i=1}^{k} (p_i - 1)$$

Bạn có thể tự hỏi, tại sao ai đó lại muốn làm điều đó? Chẳng phải điều này sẽ làm giảm tính bảo mật vì các số nguyên tố sẽ nhỏ hơn đối với cùng một độ dài khóa sao?

Mặc dù đúng là các thừa số sẽ nhỏ hơn nếu bạn sử dụng nhiều số nguyên tố hơn cho một độ dài khóa nhất định, nhưng điều đó không phải là một vấn đề bảo mật nghiêm trọng miễn là chúng không quá nhỏ. Nếu các số nguyên tố riêng lẻ có thể được tìm ra bằng các thuật toán phân tích nhân tử đã biết như ECM (Elliptic Curve Method), thì đó rõ ràng là một ý tưởng tồi. Nhưng nếu không, miễn là tổng kích thước của Modulo đủ lớn, thì việc phân tích nhân tử không phải là một mối đe dọa. Số lượng số nguyên tố bạn sử dụng càng nhiều, kích thước của Modulo càng lớn hơn.

Ví dụ : 
```python
p1, p2, p3, p4, p5 = 101, 181, 367, 487, 997 
m = 1999

n = p1 * p2 * p3 * p4 * p5
e = 7
c = pow(m, e, n)

phi = (p1 - 1)*(p2 - 1)*(p3 - 1)*(p4 - 1)*(p5 - 1)
d = pow(e, -1, phi)

pt = pow(c,  d, n)
print(pt)
#1999
```


## Common modulus
### As an external attacker
- Giả sử trong một hệ thống an ninh mạng, ở đây tất cả mọi người đều sử dụng mật mã RSA để giao tiếp. Tất cả thống nhất với nhau là sử dụng chung một Modulo $N$ và mỗi người sẽ có một cặp khóa công khai riêng biệt $(N, e_i)$ và khóa bí mật $(N, d_i)$.

- Khi mã hóa văn bản bằng cặp khóa công khai $(N, e_i)$ ta thu được $c_i$.

- Câu hỏi được đặt ra bây giờ là : Nếu ở trong vai một kẻ tấn công từ bên ngoài, bạn có được 2 cặp khóa công khai $(N, e_1)$ và $(N, e_2)$ tương ứng với đó là các văn bản đã được mã hóa bằng hai cặp khóa đó là $c_1$ và $c_2$. Bạn có thể tìm được văn bản gốc dựa trên những thứ bạn đang có không??

Để giải được bài toán này, ta sẽ sử dụng lại kiến thức về thuật toán **Euclid mở rộng (EGCD)**.

- Đầu tiên, ta tính $gcd(e_1, e_2)$, thường sẽ là $1$.
- Dựa vào lý thuyết, tồn tại 2 số $u, v$ sao cho :

$$u.e_1 + v.e_2 = gcd(e_1, e_2) = 1$$

- Biết rằng : $c_1 = m^{e_1} \Leftrightarrow (c_1)^{u} = (m^{e_1})^{u} \Leftrightarrow (c_1)^{u} = m^{{e_1}.{u}}$
> Tương tự : $c_2 = m^{e_2} \Leftrightarrow (c_2)^{v} = (m^{e_2})^{v} \Leftrightarrow (c_2)^{v} = m^{{e_2}.{v}}$

- Lấy $(c_1)^{u} \times (c_2)^{v}$ ta có : 

$$(c_1)^{u} \times (c_2)^{v} \Leftrightarrow m^{{e_1}.{u}} \times m^{{e_2}.{v}} = m^{{e_1}.{u} + {e_2}.{v}} = m^1 = m$$

Như vậy, chỉ việc tìm ra được $u, v$ dựa trên thuật toán **Euclid mở rộng** là ta đã có được văn bản gốc $m$ mà chẳng cần phải cố gắng phân tích $N = p.q$.

Code ví dụ : 
```python
from Crypto.Util.number import *
from sympy import *
import math

n = 17836315959849005845422913663414767117290475262210084622418539759689446526987983742651500754163602658702257438603344638391750819833709014484652708660912517485982576088329107650903579302135534346444527279395069706657542682545893504177489484878621091879201295227306042107538374526455876591399833571819123247023786020228360607799594672502655951840534378236130046255384167067161776621232261217694793553143425503847220013445117355362394757758134988247473606426051594142031253234833680135858089993033130033931424522824906259429530883731507010765394295893181162700003958569803358503992193879775739289254856625735853342656691
e1 = 65537
e2 = 525001
c1 = 12956480064428607663051929415489341694786960126175221607531471509163166151592308769465759388398091252599577671638542867107601637557551958661962699300916229808449711970689786058675165865289015807565556653130193626394228449937203147135725781628848153906258143100217351317252485811325186468523375573568534717653607612079275783693244062580386639900486212991796045871110659288302684641517106216437997067405408912553839693832586456218829403614151019079617637799113019415510693020930646939745008120512592748180101419173749975296706231933297833780119383366078132706597189034771296800549533021705829942484883068875788680911001
c2 = 12965904116245196938357978534525463103156557416543390261954674321347478152086334861219489464450109957205642900073444705186995343089594691875287032780058082886536690516139161055455052807719408923783472726909581836397954119248192686774570054663458648582800869594634071866071545057999986401298551718964658164474878279646414530898713051755584369843904240641579687238320401594952005314792280996311963918200344436473526816458952478423611594939473186290984225668469931992328404426484675440476604152497384742367992293290827461331396537778603227290809626138185542090594062155735604437886353995295483155150713258666215431122598


'''u, v, gcd = gcdex(e1, e2) # Tìm u,v
print(gcd, u, v)'''

u = -206277
v = 25750

flag = long_to_bytes((pow(c1, u, n) * pow(c2, v, n)) % n)
print(flag.decode())
#Output : Bạn tự tìm nhé :>
```





### As an internal attacker
Nếu ở phần trên, bạn tấn công với tư cách là người ngoài tổ chức, thì ở lần này bạn sẽ trở thành kẻ phản bội vĩ đại, khi mà bạn cố gắng tìm ra được khóa bí mật của đồng nghiệp.

- Nói một cách dễ hiểu hơn thì bạn có 2 cặp khóa công khai và bí mật là $(N, e_1)$ và $(N, d_1)$.
- Người bạn muốn tấn công có 2 cặp khóa công khai và bí mật là $(N, e_2)$ và $(N, d_2)$.

> Vậy làm thế nào mà từ bộ khóa của bạn mà có thể suy ra được khóa bí mật của người kia?? Vì cả 2 đều nằm trong cùng một tổ chức nên sẽ có cùng modulo $N$.


Để có được khóa bí mật $d$ thì cần phải thỏa mãn công thức: 

$$e.d \equiv 1 \pmod{\phi(N)}$$

Công thức này tương đương : 

$$k.\phi(N) + 1 = e.d$$

$$\Leftrightarrow k = \frac{e.d - 1}{\phi(N)}$$
>$k$ là phần nguyên trong phép chia $e.d$ với $\phi(N)$

Vì $N > \phi(N)$ nên ta có : 

$$\frac{1}{N} < \frac{1}{\phi(N)}$$

$$\Leftrightarrow \frac{e.d - 1}{N} < \frac{e.d - 1}{\phi(N)}$$

$$\Leftrightarrow k_2 < k_1$$

Ở đây $k_2$ hoàn toàn có thể tính được. Sau khi có được $k_2$ thì ta sẽ tăng $k_2$ lên sao cho đến một lúc nào đó:

$$k_2 = \frac{e.d - 1}{\phi(N)} $$
> Ta có thể làm như vậy vì khi $N$ đủ lớn thì $N \approx \phi(N)$
> - $k$ tỉ lệ nghịch với $N$
> - Tăng $k$ đồng nghĩa với giảm $N$ sao cho một lúc nào đó $N = \phi(N)$

Ví dụ : 
```python
# Given : 
N = 117704067672883037376030830145700215357572435982701916566499889223000013519955331766548499616330205185281466326045375998482067680554871351096186175802407426623567339183089956168585674798584299942705999002628197040366578193734017048991401354035799191823625940444165646453369894762305964576694418965387598209207
e = 525001
d = 90403160815756604198542622735461892369787541962941295333801340066358372835809871977676507571106355313888763431158277709684504307008407530536607219512488826563985009767307262061155202811565059766483805572368172577687292368582563775852284641603155288152250413326785204996823580920021255671338179548068268969569

# Tính k 
k = (e*d - 1) // N #lấy phần nguyên

# Check đúng sai
while True:
    phi = (e * d - 1) // k
    if k * phi == (e * d - 1): #Nếu đẳng thức này đúng thì in k, phi
        print("k =", k)
        print("phi =", phi)
        break
    else:
        k = k + 1 #Sai thì tăng k lên 1 đơn vị và tính lại
#Output : 
#k = 707618
#phi = 67072558684817278476295226349160463634377346701307969824878730241709809667324769293816924034349617514177020214468155072174640053932659940729672403544392802945824857639073737368705350388591680740828758467561400319746538642033151453024407645263826145512436963512764739461881095176482338279563571871992217944276
```
Sau khi có được $\phi(N)$ thì ta hoàn toàn có thể tính được :

$$d = e^{-1} \mod(\phi(N))$$

Đây là khóa bí mật của người mà bạn muốn tấn công.




## Small public exponent
Để mật mã RSA trở nên an toàn thì phải chọn $N$ đủ lớn để kẻ tấn công khó mà phân tích $N$ thành tích của nhiều số nguyên tố, đó là nguyên tắc cơ bản mà ta biết. 

Tuy nhiên, ta lại bỏ qua một điều quan trọng khác đó là số mũ $e$. Nếu mà chọn số $e$ quá nhỏ như $e=1, e=3,...$ thì đó sẽ trở thành lỗ hổng lớn để kẻ tấn công khai thác.

Ví dụ : Ta đã biết công thức mã hóa

$$c \equiv m^{e} \pmod{N}$$

Khi mà $e$ quá nhỏ thì sẽ dẫn đến $m^{e} < N$, từ đó : $m^{e}$ **mod** $N$ $=$ $m^{e}$

Hay chính là : 

$$c = m^{e}$$

$$\Leftrightarrow c^{\frac{1}{e}} = m$$

Ta chỉ cần lấy văn bản đã mã hóa $c$ và mũ $\frac{1}{e}$ thì sẽ ra được văn bản gốc $m$ vì $e$ lúc này đã quá nhỏ để dễ dàng tính.

Nhưng giả sử $m$ đủ lớn để khi này $m^{e} > N$, ta vẫn có thể tính được như sau :

$$c \equiv m^{e} \pmod{N}$$

$$\Leftrightarrow m^{e} = c + k.N$$

$$\Leftrightarrow m = (c + k.N)^{\frac{1}{e}}$$

Với $k$ là một nhỏ nào đó, ta Brute force $k$ đến khi nào có thể căn ra được thì dừng.






## Hastad’s Broadcast Attack
Cũng như những nội dung đã nói trong phần **Small public exponent**, nhưng xét trong trường hợp tin nhắn quá dài thì cũng sẽ rất khó để tính căn được. Tuy nhiên thì Ciphertext lại được gửi đi cho nhiều người khác sử dụng chung một $𝑒$ hoặc là nhiều người cùng gửi cho mình một tin nhắn có nội dung giống nhau, sử dụng cùng một $𝑒$.

Giả sử $m$ là văn bản gốc, đặt $M = m^{e}$. Khi này ta có ciphertext là :

$$c_i \equiv M \pmod{N_i}$$

Xét hệ phương trình Modulo : 

$$
\begin{cases} 
M \equiv c_1 \pmod{N_1} \\ 
M \equiv c_2 \pmod{N_2} \\ 
M \equiv c_3 \pmod{N_3} 
\end{cases}
$$
> Số lượng $c_i$ cần thiết phải $\geq3$, tức $i \geq 3$.

Bây giờ ta sẽ sử dụng **[Định lý thặng dư Trung Hoa (CRT)](https://vi.wikipedia.org/wiki/%C4%90%E1%BB%8Bnh_l%C3%BD_s%E1%BB%91_d%C6%B0_Trung_Qu%E1%BB%91c#:~:text=%C4%90%E1%BB%8Bnh%20l%C3%BD%20s%E1%BB%91%20d%C6%B0%20Trung%20Hoa%20%28%C4%90%E1%BB%8Bnh%20l%C3%BD,n%C3%B3%20l%C3%A0%20b%C3%A0i%20to%C3%A1n%20H%C3%A0n%20T%C3%ADn%20%C4%91i%E1%BB%83m%20binh.)** để giải hệ phương trình tìm M và tính căn bậc $e$ là ra

![{F05B5AE1-1E10-4C1D-9317-546B18C2E63D}](https://hackmd.io/_uploads/HJWlyKFV1e.png)

Thuật toán : 
```python
from Crypto.Util.number import *
import gmpy2

# nhớ là hãy sắp xếp đúng thứ tự, n nào ứng với c đó, tránh nhầm lẫn
list_N = [N1, N2, N3] #N và c là do đề bài cho, ở đây chỉ là tượng trưng.
list_c = [c1, c2, c3] 



N = list_N[0] * list_N[1] *list_N[2]
N1 = N // list_N[0]
N2 = N // list_N[1]
N3 = N // list_N[2]

y1 = pow(N1, -1, list_N[0]) 
y2 = pow(N2, -1, list_N[1])
y3 = pow(N3, -1, list_N[2])
           
M = (list_c[0]*y1*N1 + list_c[1]*y2*N2 + list_c[2]*y3*N3) % N
print(M)
```
Ví dụ minh họa giải phương trình trên : 
```python
from Crypto.Util.number import *
import gmpy2

# nhớ là hãy sắp xếp đúng thứ tự, n nào ứng với c đó, tránh nhầm lẫn
list_N = [3, 5, 7]
list_c = [2, 3 ,5]


N = list_N[0] * list_N[1] *list_N[2]
N1 = N // list_N[0]
N2 = N // list_N[1]
N3 = N // list_N[2]

y1 = pow(N1, -1, list_N[0]) 
y2 = pow(N2, -1, list_N[1])
y3 = pow(N3, -1, list_N[2])
           
M = (list_c[0]*y1*N1 + list_c[1]*y2*N2 + list_c[2]*y3*N3) % N
print(M)
#output M = 68 
#Ở đây mình đã sửa lại các biến cho phù hợp với RSA
```




## Brute force attack on small secret CRT-Exponents
Chúng ta đã thấy rằng **Định lý phần dư Trung Hoa (CRT)** có thể được sử dụng để tăng tốc quá trình mã hóa và giải mã RSA. Trong trường hợp này, chúng ta quan tâm đến quá trình giải mã.

Để giải mã RSA bằng CRT, ta cần tính:

$$
\begin{cases}
d_p \equiv e^{-1} \mod(p-1) \\
d_q \equiv e^{-1} \mod(q-1) \\
\end{cases}
$$

Ở đây có thể hiểu $e$ phải là nghịch đảo của $d_p$ trong modulo $p-1$, tương tự với $d_q$ trong modulo $q-1$. Nếu như $e$ được chọn không đúng, $d_p$ và $d_q$ có thể nhỏ đến mức có thể brute-force.

Hãy bắt đầu với công thức $d_p$. Ta có : 

$$
d_p \equiv e^{-1} \mod(p-1)
$$

$$
\Leftrightarrow d_p.e\equiv 1 \mod(p-1)
$$

$$
\Leftrightarrow d_p.e = k.(p-1) + 1
$$

Chọn một số nguyên $r$ sao cho $gcd(r, p) = 1$

$$
=> r^{d_p.e} = r^{k.(p-1) + 1} = r.(r^{p-1})^{k}
$$

Theo định lý Fermat nhỏ thì ta có : 

$$
(r^{p-1})^{k} \equiv 1^k \pmod{p} \equiv 1 \pmod{p} 
$$

$$
=>r.(r^{p-1})^{k} \equiv r.1^k \pmod{p} \equiv r \pmod{p} 
$$

Từ đây ta có thể suy ra : 

$$
r^{e.d_p} \equiv r \mod(p)
$$

$$
=> r^{e.d_p} = k.p + r
$$

$$
\Leftrightarrow r^{e.d_p} - r = k.p
$$

Từ đây ta có : 

$$
gcd(r^{e.d_p} - r, n) = gcd(k.p, p.q) = p
$$

Khi $e$ chọn sai cách sẽ dẫn đến việc $d_p$ trở nên khá nhỏ nên ta hoàn toàn có thể brute-force $d_p$. Từ đó có thể tính được $p$.

Ví dụ : 
```python
n = 95580702933509662811256129990158655210667121276245053843875590334281563078868202152845967187641817281520364662600110239110410372520340630639373679599982371620736610194814723749147422221945978800055101110346161945811520158431287139909125886966214800526831490560384144156085296004816333892025839072729987354233
e = 1817084480271067137841898198122075168542117135135738925285694555698012943264936112861815937200507849960517390660821911331068907250788900674614345400567411

#lấy đại r 
r = 7516789928765 
for dp in range(1000000):
   f = gmpy2.gcd(m-pow(r, e*dp, n), n)
   if f > 1:
       print(dp, f)
       break
```
![{4745743A-5F13-4C36-8BB5-9D4C3E9C73CE}](https://hackmd.io/_uploads/B1FiLo69Jx.png)

Check lại bằng sagemath thì đó là đáp án đúng. 
![{C5B6D88F-2BB1-4BF4-8961-3934E506B943}](https://hackmd.io/_uploads/SyU8viacyg.png)



## Fault attack on signatures
Khi chúng ta nói về các cuộc tấn công vào RSA CRT, hãy tập trung vào quá trình ký. Quá trình này giống hệt với giải mã, nhưng thay vì áp dụng nó lên Ciphertext, ta áp dụng lên Plaintext.


Ta sẽ **"sign"** Plaintext với từng số mũ $d_p, d_q$ trong Modulo $p,q$. Cụ thể

$$
\begin{cases}
s_p \equiv m^{d_p} \pmod{p} \\
s_q \equiv m^{d_q} \pmod{q} 
\end{cases}
\Rightarrow s \equiv m^d \pmod{pq}
$$
>với $d_p \equiv e^{-1} \mod(p-1)$, $d_q \equiv e^{-1} \mod(q-1)$

Nếu như không có lỗi trong cả quá trình kí từng phần $s_p, s_q$ thì kiểm tra ở chữ kí cuối cùng ta sẽ có : 

$$
\begin{cases}
s^e \equiv m \mod(p) \\
s^e \equiv m \mod(q)
\end{cases}
\Leftrightarrow
\begin{cases}
s^e - m\equiv 0 \mod(p) \\
s^e - m\equiv 0 \mod(q)
\end{cases}
\Leftrightarrow
\begin{cases}
s^e - m = k_1p \\
s^e - m = k_2q
\end{cases}
$$

$$
\Rightarrow s^e - m = k_3.pq
$$

Khi này, $s^e - m$ sẽ là bội của $n$ với việc : 

$$
gcd((s^e - m), n) = gcd(k_3.n, n) = n
$$

Thế nhưng, khi chỉ cần 1 phần **"sign"** với $p$ hoặc $q$ bị lỗi 1 bit hoặc là nhiều bits, ta sẽ thấy ngay 1 điều khá thú vị :smile: 

$$
\begin{cases}
s^e \not\equiv m \mod(p) \\
s^e \equiv m \mod(q)
\end{cases}
\Leftrightarrow
\begin{cases}
s^e - m\not\equiv 0 \mod(p) \\
s^e - m\equiv 0 \mod(q)
\end{cases}
\Leftrightarrow
\begin{cases}
s^e - m \neq k_1p \\
s^e - m = k_2q
\end{cases}
$$

$$
\Rightarrow s^e - m = k_3.q
$$

Chữ kí đã xác minh $s^e$ đồng dư với $m$ theo Modulo $q$ nhưng không theo Modulo $p$. Khi đó ta có : 

$$
\Rightarrow gcd((s^e - m), n) = gcd(k_3.q, n) = q
$$

Ta có thể tìm được một trong hai số $p,q$, từ đó có thể tìm được số còn lại. 

Cuộc tấn công này chỉ có hiệu quả nếu kẻ tấn công biết trước Plaintext. Điều này cũng có nghĩa là không có bất kỳ cơ chế đệm ngẫu nhiên nào được áp dụng lên thông điệp trước khi ký.

```python
from Crypto.Util.number import*
from functools import reduce
import gmpy2

flag = b"HL{Crypto_is_math}"
p, q = getPrime(1024), getPrime(1024)
e = 65537
n = p*q
d = inverse(e,(p-1)*(q-1))
c = pow(bytes_to_long(flag), e, n)

print("n =",n)
print("e =",e)
print("c =",c)

def chinese_remainder(rests, modulus):
        somme = 0
        prod = reduce(lambda a, b: a * b, modulus)
        for n_i, a_i in zip(modulus, rests):
            p = prod // n_i
            somme += a_i * gmpy2.invert(p, n_i) * p
        return int(somme % prod)

def sign(m, fault = False):
    dp = inverse(e,p-1)
    dq = inverse(e,q-1)
    sp = pow(m, dp, p)
    sq = pow(m, dq, q)
    if fault:
        sq += 1
    s = chinese_remainder([sp, sq], [p, q])
    return s

m = int(input("Nhập m = "))  

s = sign(m, True)
a = pow(s, e) - m

p = gmpy2.gcd(a, n)
print(n // p == q)
```
Khi chạy code thì ta sẽ có $(N,e,c)$, hoàn toàn không hề biết $p,q$. Ta đã gây lỗi ở giai đoạn tính $s_q$ nên khi này, khi nhập $m$ bất kì vào, ta có thể đem đi **sign m** rồi tính : 

$$
a = s^e - m \\
\Rightarrow p = gcd(a, n)
$$

Như vậy ta đã có được $p$, tìm $q$ nữa là xong. 
![{8C3A10BB-3799-4629-8DDC-1576A9DF1FD3}](https://hackmd.io/_uploads/BJLEA1Rqyl.png)





## Fermat’s attack
- Để cấu tạo nên $N$ thì cần phải chọn ra 2 số nguyên tố $p, q$ đủ lớn để nhân lại với nhau thành $N$. Tuy nhiên, việc chọn 2 số nguyên tố $p, q$ quá gần nhau cũng là một lỗ hỏng lớn dễ bị khai thác. Ví dụ : $p = 11, q = 13$. 

- Tổng quát hơn, nếu $p, q$ thỏa : 

$$
0 < p - q < \sqrt[4]{N}
$$

- Thì đó là lúc **Fermat’s attack** phát huy tác dụng.

Xét : 

$$
N = p.q = (\frac{p+q}{2})^2 - (\frac{p-q}{2})^2
$$

- Đặt $a = \frac{p+q}{2}$ và $b = \frac{p-q}{2}$ ta có : 

$$
N = a^{2} - b^{2} = (a+b).(a-b) = p.q
$$

- Khi này ta có : $p = (a+b)$ và $q = (a-b)$ (đồng nhất thức)

Vì $p, q$ khá gần nhau nên ta có : 

$$
\frac{p+q}{2} \approx \sqrt{N} = \sqrt{p.q}
$$
>Đây chính là liên hệ tới bất đẳng thức Cauchy, dấu "=" xảy ra khi và chỉ khi $p = q$, còn khi $p, q$ là 2 số gần nhau thì ta có đẳng thức trên.

- Thế $p = (a+b)$ và $q = (a-b)$ vào ta có : 

$$
\frac{2a}{2} \approx \sqrt{N} \Leftrightarrow a \approx \sqrt{N}
$$

- Bây giờ ta đặt $a = \lceil \sqrt{N} \rceil$
> $\lceil x \rceil$ được gọi là số nguyên trần, có nghĩa là số nguyên nhỏ nhất lớn hơn hoặc bằng một số thực nào đó 
> Ví dụ : 
> $$
\lceil 3.2 \rceil = 4, \quad \lceil 5.0 \rceil = 5, \quad \lceil -1.7 \rceil = -1
$$

- Khi này ta có : $b^{2} = a^{2} - N$ hay $b = \sqrt{a^{2} - N}$

- Ta sẽ kiểm tra xem $b^{2}$ có phải một số chính phương hay không, nếu không thì ta tiếp tục tăng $a$ lên đến khi nào kết quả là một số chính phương thì dừng.

- Có $b^{2}$ là một số chính phương, ta dễ dàng tính được $p, q$ với

$$
\begin{cases} 
p = a + b \\ 
q = a - b \\ 
\end{cases}
$$

Code mẫu : 
```python
import math 

N = 

a = math.isqrt(N)
if a*a < N:
    a = a + 1

while True:
    b_bình = a*a - N
    b = int(math.isqrt(b_bình))
    if b*b == b_bình:
        p = a - b
        q = a + b
        print("p =", p)
        print("q =", q)
        break
    a = a + 1
```


## Twin primes
Một biến thể khác của Fermat’s attack, nhưng nó đơn giản hơn nhiều, khi mà ta chọn hai số nguyên tố $p,q$ sao cho $q = p + 2$. Những số nguyên tố $p,q$ kiểu như này thì ta gọi đó là **số nguyên tố sinh đôi (Twin Primes)** 

Một vài cặp số nguyên tố sinh đôi tiêu biểu : $(3,5),(11,13),(17,19),(29,31),...$

Và khi này ta sẽ có : 

$$
n = p.q
$$

$$
\Leftrightarrow n = p.(p+2)
$$

$$
\Leftrightarrow p^2 + 2p - n = 0
$$

Với $\Delta = 4 + 4n$, ta có : 

$$
\begin{cases}
x_1 = \frac{-b + \sqrt{\Delta}}{2a} = \frac{-2 + \sqrt{4n + 4}}{2} = \frac{-2 + \sqrt{4n + 4}}{2} = \sqrt{n+1} - 1  \\
x_2 = \frac{-b - \sqrt{\Delta}}{2a} = \frac{-2 - \sqrt{4n + 4}}{2} = \frac{-2 - \sqrt{4n + 4}}{2} = -\sqrt{n+1} - 1
\end{cases}
$$

Rất chi là đơn giản để tính :smile: 
Ví dụ : 
![{C6648370-014A-42DB-9B1F-B1DC8EBC95EB}](https://hackmd.io/_uploads/SyDZkh69Jx.png)






## Wiener’s attack (Low Private Exponent)
- Như trong phần **Small public exponent** đã nói, nếu số mũ $e$ quá nhỏ thì sẽ rất dễ bị tấn công chỉ bằng việc tính căn bậc $e$ của $ciphertext$. Vậy trường hợp ngược lại thì sao? Số mũ $e$ trở nên quá lớn, lớn gần bằng hoặc hơn $N$, liệu nó có an toàn hơn không??

- Cái gì quá thì cũng không tốt, điều đó đúng với cả số mũ $e$

- Ta biết rằng, số mũ công khai $e$ và số mũ bí mật $d$ liên hệ với nhau qua công thức :

$$
e.d \equiv 1 \pmod{\phi(N)}
$$

> Nó có nghĩa là $e$ và $d$ là $2$ đại lượng tỉ lệ nghịch với nhau, là nghịch đảo Modulo $\phi(N)$. Chính vì vậy, khi $e$ quá lớn sẽ dẫn đến việc $d$ trở nên quá nhỏ, từ đó rất dễ bị tấn công. Tiêu biểu nhất đó chính là : **Wiener’s attack**.

Điều kiện để thực hiện Wiener’s attack là : 

$$
\begin{cases}
d < \frac{1}{3} \sqrt[4]{N} \\
q < p < 2q \\
e < n ^{\frac{3}{2}}
\end{cases}
$$



Để tấn công, ta có thể sử dụng `thư viện Owiener`, cho phép chúng ta tìm ra $d$ từ $e$ và $N$.

Ta có thể cài `thư viện Owiener` bằng lệnh `pip install owiener` trong `cmd`

![{743A4D22-18C1-43AA-ADAE-0062DCFB20EF}](https://hackmd.io/_uploads/B1yih2SEkg.png)

Sau khi cài thì ta chỉ cần khai báo và xài lệnh tìm $d$ là xong 
```python
import owiener
d = owiener.attack(e,N)
```
Ví dụ : 
```python
import owiener
from Crypto.Util.number import long_to_bytes


# Đưa chuỗi hex về số bằng cách dùng hàm int()
N = int(0xa0d9f425fe1246c25b8c3708b9f6d7747dd5b5e7f79719831c5cbe19fb7bab66ed62719b3fc6090120d2cfe1410583190cd650c32a4151550732b0fc97130e5f02aa26cb829600b6ab452b5b11373ec69d4eaae6c392d92da8bcbea85344af9d4699e36fdca075d33f58049fd0a9f6919f3003512a261a00985dc3d9843a822974df30b81732a91ce706c44bde5ff48491a45a5fa8d5d73bba5022af803ab7bd85250e71fc0254fcf078d21eaa5d38724014a85f679e8a7a1aad6ed22602465f90e6dd8ef95df287628832850af7e3628ad09ff90a6dbdf7a0e6d74f508d2a6235d4eae5a828ac95558bbdf72f39af5641dfe3edb0cdaab362805d926106e2af)
e = int(0x5af5dbe4af4005564908a094e0eabb0a921b7482483a753e2a4d560700cb2b2dc9399b608334e05140f54d90fcbef70cec097e3f75395d0c4799d9ec3e670aca41da0892a7b3d038acb7a518be1ced8d5224354ce39e465450c12be653639a8215afb1ba70b1f8f71fc1a0549853998e2337604fca7edac67dd1e7ddeb897308ebf26ade781710e6a2fe4c533a584566ea42068d0452c1b1ecef00a781b6d31fbab893de0c9e46fce69c71cefad3119e8ceebdab25726a96aaf02a7c4a6a38d2f75f413f89064fef14fbd5762599ca8eb3737122374c5e34a7422ea1b3d7c43a110d3209e1c5e23e4eece9e964da2c447c9e5e1c8a6038dc52d699f9324fd6b9)
c = int(0x731ceb0ac8f10c8ff82450b61b414c4f7265ccf9f73b8e238cc7265f83c635575a9381aa625044bde7b34ad7cce901fe7512c934b7f6729584d2a77c47e8422c8c0fe2d3dd12aceda8ef904ad5896b971f8b79048e3e2f99f600bf6bac6cad32f922899c00fdc2d21fcf3d0093216bfc5829f02c08ba5e534379cc9118c347763567251c0fe57c92efe0a96c8595bac2c759837211aac914ea3b62aae096ebb8cb384c481b086e660f0c6249c9574289fe91b683609154c066de7a94eafa749c9e92d83a9d473cc88accd9d4c5754ccdbc5aa77ba9a790bc512404a81fc566df42b652a55b9b8ffb189f734d1c007b6cbdb67e14399182016843e27e6d4e5fca)


# Tìm d dễ dàng với owiener
d = owiener.attack(e,N)

m = pow(c,d,N)
print(long_to_bytes(m).decode())
#pctf{fun_w1th_l4tt1c3s_f039ab9}
```



## Boneh Durfee Attack
Một biến thể khác của Wiener’s attack, nhưng điều kiện ở đây là : 

$$
d < N^{0.292}
$$

Boneh-Durfee Attack là một phương pháp tấn công RSA khi khóa bí mật $d$ quá nhỏ so với Modulo $N$. Nó khai thác lỗ hổng trong cách chọn khóa bí mật và sử dụng Giải tích lưới (Lattice Reduction) để tìm ra $d$. Về lattice thì nó hơi phức tạp nên mình chưa thể giải thích ngay đây được.

Ở đây mình có một **[tools](https://github.com/mimoo/RSA-and-LLL-attacks/blob/master/boneh_durfee.sage)** để giải các dạng bài như thế này 

Về cách dùng thì bạn lướt xuống chỗ Modulo như này : 
![{5AE4823C-B0D8-443A-BF58-11E823489510}](https://hackmd.io/_uploads/S17uehT91x.png)

Rồi thay bằng cặp khóa công khai $(N,e)$ mà đề bài cho là được. Ở đây mình sẽ thử chạy file của họ luôn. 
![{8AD19254-67F9-4860-B446-1AB84FBC383A}](https://hackmd.io/_uploads/HkqrZ2TcJe.png)

Vậy là ta có thể tìm được $d$ rồi!!



## Blinding attack (Decipher oracle)
Trong một số challenge CTF thường sẽ cho ta thao tác với Server mà tại đó : Server sẽ cung cấp cho ta một công cụ để mã hóa và giải mã bằng RSA.

Ta có quyền lựa chọn những option mà ta muốn thực hiện và khi truyền vào đó những Input bất kì, Server sẽ trả lại thứ mà ta muốn.

Hãy thử giả sử như thế này : 
- Server cung cấp cho ta các hàm mã hóa và giải mã RSA
- Ta cũng có thể nhận được bộ ba $(N,e,ct)$
- Có thể nói là khi này ta hoàn toàn có thể gửi $ct$ vào hàm giải mã để nhận được Flag, tuy nhiên Server sẽ từ chối làm như vậy nếu phát hiện giải mã $ct$ là Flag

Chính vì vậy, vấn đề được đặt ra là làm sao có thể qua mặt được Server, gửi vào $ct$ mà Server sẽ giải mã giúp chúng ta để nhập được Flag?
- Đầu tiên, ta biết được công thức mã hóa là : 

$$
c \equiv M^{e} \pmod{N}
$$

- Nhân $c$ với một thành phần $r$ là :  

$$
r^{e} mod (N)
$$

- Ta có: 

$$
M' \equiv r^{e}.c \pmod{N}
$$
- Khi đưa cho Server giải mã thì Server sẽ dùng khóa bí mật của mình : 

$$
(M')^{d} = r^{e.d} \times c^{d} = r^{e.d} \times M^{e.d} = r \times M
$$
- Server sẽ kiểm tra và sẽ thấy đó là một tin nhắn có dạng : $M \times r$, và Server sẽ chẳng thể phát hiện ra đó là Flag. Còn chúng ta sau khi nhận được chuỗi mà Server trả về thì chỉ cần tính : 

$$
M = \frac{M'}{r}
$$

Và thế là ta đã có thể qua mặt được Server mà không lo bị phát hiện!
>Ví dụ: Challenge Baby Crypto BITSCTF2025
```python
from Crypto.Util.number import *

#given value
n = 144340364993250854007978847312006646423533723277221509581526408686508070126529037428428272306944388831553157178310696833882009756821836638119725660640876169109045587137622881570080351241841262836399733034903350052753059642864615599553145860048479687627111711227232747542861246657620738469001376240053793222187
e = 65537
ct = 119637947199534313671247094142508486546567571210590476244252247603869862080209207741866150810935750441581262550398817567250940777105839519744545103353691802773631177845132642284088391423932501307241876818649014959325042906284818667857751818057214690286309

# lấy đại một giá trị r nào đó
r = 2

# lấy new_ct này đi giải mã
new_ct = (ct * pow(r, e, n)) % n
print(new_ct)

fake_plaintext = 39639837536156593072703000049994066086289431135207913625429785307924943603979635946981909260898213168370823268973219279443746657679296399190096606077830951260950823052936192667655676091351812437731066
print((long_to_bytes(fake_plaintext // r)).decode())
```


## Parity Oracle (LSB Oracle)
Hãy giả thử ta có một challenge như sau : 
```python
from Crypto.Util.number import *
from os import urandom

flag = bytes_to_long(b"Raccoon{the_least_significant_bit_is_important}")
#49529326316924133966035971391576834107328317136211266556845373734296878034761119121481159566340108734461689885821

p,q = getPrime(512),getPrime(512)
n = p*q
e = 0x10001
d = inverse(e,(p-1)*(q-1))
assert flag < n
ct = pow(flag, e, n)

print(f"{n = }")
print(f"{e = }")
print(f"{ct = }")

while True:
    ct = int(input("> "))
    pt = pow(ct, d, n)
    out = ""
    if pt == flag:
        print("bro you are not allowed to send the whole ct")
        exit() 
    else:
        if pt % 2 == 0:
            print("even")
        else:
            print("odd")
# Source mượn từ a LeHa :>
```

Về cơ bản thì nó là **Blinding attack**, vẫn cho ta nhập một Text bất kì và kiểm tra xem đó có phải Flag không. Nếu phải thì sẽ thoát.

Tuy nhiên, điều đáng chú ý là khi ta nhập một Text vào thì hàm sẽ trả về cho ta hai kết quả là `EVEN` or `ODD` (bit 0 hoặc 1) thay vì là một bản đã giải mã của Input ta đã nhập vào. 

Điều đó sẽ tạo cơ hội cho **Parity Oracle (hay LSB Oracle)**

Ta luôn biết rằng, $n$ là tích của số nguyên tố $p,q$. Mà $p,q$ luôn là số lẻ nên $n$ lúc này cũng sẽ là số lẻ.
>Tất nhiên là số 2 cũng được xem như là một số nguyên tố và đó là số nguyên tố chẵn duy nhất tồn tại. Tuy nhiên thì việc chọn 2 làm số nguyên tố thành phần tạo nên Modulo $n$ là việc rất là sai lầm !!!

Cho $m$ là Plaintext dạng số nguyên. Bạn sẽ chẳng biết được đó là số chẵn hay lẻ. Tuy nhiên bạn sẽ chắc chắn biết được rằng $2m$ là số chẵn. Khi này ta có : 
- Nếu $2m < n$ thì $2m$ **mod** $n$ sẽ là số chẵn, phép Modulo sẽ không ảnh hưởng.
- Nếu $2m < n$ thì $2m$ **mod** $n$ sẽ là số lẻ vì $n$ là số lẻ. 

Giả sử ta gửi đến Server một Ciphertext có dạng là $2m$. Nếu kết quả trả về là `odd` thì chứng tỏ : 

$$
2m > n
$$

$$
\Rightarrow \frac{n}{2} < m < n
$$

- Nếu mà ta gửi vào một Ciphertext có dạng $4m$ thì bản chất là ta đang tính $4m\mod(n)$.
- Ta biết rằng : $2m>n$ nên $2m\mod(n) = 2m-n$
- Xét $4m = 2(2m)$, lấy Modulo 2 vế : $4m \mod(n) = 2(2m\mod(n))$
- Vì $2m>n$ nên $2m\mod(n) = 2m-n$, thay vào ta có : $4m \mod(n) = 2(2m-n) = 4m - 2n$

Như vậy khi thay đổi thành $4m$ thì ta sẽ thu về một kết quả chẵn trong phép tính $4m \mod(n)$ và $4m-2n<n$

Từ đó suy ra : $m<\frac{3n}{4}$. Như vậy khi này ta đã có khoảng giá trị mới của $m$ là : 

$$
\frac{n}{2} < m < \frac{3n}{4}
$$

Và cứ như thế, khi gửi $8m, 16m, 32m,...$ ta sẽ khỏa sát được khoảng giá trị của $m$ và thu hẹp lại khoảng không gian chứa $m$. Cho đến cuối cùng, khi không gian trở nên quá nhỏ thì ta có thể brute-force được.





## Bleichenbacher's Attack on PKCS 1
Về cơ bản thì RSA làm việc trên số nguyên lớn. Nếu như Plaintext được mã hóa quá nhỏ thì nó sẽ rất dễ bị tấn công. Để khắc phục điều này, **PKCS#1 v1.5** yêu cầu đệm (padding) trước khi mã hóa. 

Giả sử khóa RSA có độ dài là $k$ bytes, tức là Modulo $N$ có kích thước là $k$ bytes. Khi này, **PKCS#1 v1.5** sẽ padding vào Plaintext làm sao cho nó đủ độ dài là $k$ như Modulo $N$. Quá trình này hoạt động như sau:
- Khối Plaintext sẽ được đặt ở cuối cùng, phần đầu là của việc Padding
- Byte `0x00` sẽ luôn làm byte đầu tiên để phân biệt với số nguyên có dấu
- Byte thứ hai là một byte kiểu **BT (Block Type)**, gồm 2 lựa chọn chính : 
    - Byte `0x02` : Được sử dụng trong mã hóa dữ liệu.
    - Byte `0x01` : Chỉ dùng trong chữ ký số (không dùng cho mã hóa).
- Phần tiếp theo sau byte kiểu **BT** là **PS (Padding String)** : là một dãy padding gồm các byte không phải `0x00`, giúp đảm bảo đủ độ dài
- Sau đó sẽ là byte `0x00` với mục đích đánh dấu sự kết thúc của padding.
- Và cuối cùng là phần Plaintext của chúng ta

Tham khảo sơ đồ này : 
![image](https://hackmd.io/_uploads/Hkhxrmejkx.png)

Về cơ chế hoạt động của hệ thống : Một Server thường kiểm tra padding khi nhận được Ciphertext rồi thông báo kết quả:
- Hợp lệ: Padding đúng.
- Không hợp lệ: Padding sai.

Nếu mà Ciphertext sau khi giải mã không theo đúng cấu trúc Padding của **PKCS#1 v1.5** thì nó sẽ bị coi là không hợp lệ.

Ý tưởng tấn công như sau : Giả sử, ta có được Ciphertext $c_0$, bây giờ ta cần phải tìm ra Plaintext $m_0$. Trước hết, ta sẽ nhân $c_0$ với một hằng số $s_1^e$ bất kì. Ta có :

$$
c' \equiv c_0\times s_1^e \mod(N)
$$

Sau đó gửi $c'$ cho hệ thống để hệ thống kiểm tra. 

$$
m' \equiv (c')^d \mod(N)
$$

$$
\Leftrightarrow m' \equiv (c_0\times s_1^e)^d \mod(N)
$$

$$
\Leftrightarrow m' \equiv c_0^d\times s_1 \mod(N)
$$

$$
\Leftrightarrow m' \equiv m\times s_1 \mod(N)
$$
Nếu như kết quả trả về là `Invalid Padding` thì ta sẽ biến đổi $r$ sao cho tới lúc nào đó $c'$ của ta giải mã ra được $m'$ theo đúng format Padding của **PKCS#1 v1.5**.

Chọn hằng số $B = (2^{8})^{(k-2)}$, với $k$ là kích thước của khóa tình bằng byte và vì 2 byte đầu tiên là `0x00` và `0x02` nên mới trừ 2. Khi này, nếu $m'$ được hệ thống báo là `Valid Padding` thì điều đó có nghĩa là : 

$$
2B \leq m.s_1\mod(N) < 3B
$$
>Khi 2 byte đầu là `0x00`, `0x02` và các byte còn lại là `0x00` thì $m_{min}=0x000200...00=2\times (2^{8})^{(k-2)}=2B$
>Còn nếu các byte còn lại là `0xFF` thì $m_{max} = 0x0002FF...FF=3\times (2^{8})^{(k-2)}-1=3B-1$

Khi này ta có : 

$$
2B \leq m.s_1\mod(N) < 3B
$$

$$
\Leftrightarrow 2B \leq (m.s_1-r_1.N) < 3B
$$

$$
\frac{2B+r_1N}{s_1} \leq m < \frac{3B+r_1N}{s_1}
$$

Vậy là ta đã có khoảng không gian của $m$, bây giờ ta tiếp tục chọn $s_2>s_1$ và khi đó : 

$$
\frac{2B+r_2N}{s_2} \leq m < \frac{3B+r_2N}{s_2}
$$

Với $s$ ngày càng tăng, thì khoảng không gian của $m$ sẽ ngày càng thu hẹp lại. Từ đó dễ ta có thể brute-force $m$.





## Franklin-Reiter Related Message Attack
Giả sử rằng, có hai Plaintext $m_1, m_2$ thỏa mãn :

$$\begin{cases}
m_1, m_2 < N \\
m_1\neq m_2 \\
m_1 \equiv f(m_2) \mod(N)
\end{cases}$$
>Trong đó : f là một đa thức đã biết trước với $f \in Z_N[x]$.

Hai Plaintext sẽ được mã hóa cùng với một cặp khóa công khai $(N,e)$ cho ra $c_1,c_2$. Khi này, chỉ với 5 thứ $(N,e,c_1,c_2,f)$ thì kẻ tấn công có thể khôi phục lại $m_1,m_2$ bằng cách tấn công **Franklin-Reiter Related Message Attack**

Trước hết, ta có $c_1, c_2$ được tính như sau :

$$\begin{cases}
c_1 \equiv m_1^e \mod(N)\\
c_2 \equiv m_2^e \mod(N)
\end{cases}$$

$$\Leftrightarrow \begin{cases}
c_1 \equiv f(m_2)^e \mod(N)\\
c_2 \equiv m_2^e \mod(N)
\end{cases}$$

$$\Leftrightarrow \begin{cases}
f(m_2)^e-c_1\equiv0 \mod(N)\\
m_2^e-c_2\equiv0 \mod(N)
\end{cases}$$

Ở đây ta đặt hai đa thức là :

$$\begin{cases}
g_1(x) = f(x)^e - c_1 \\
g_2(x) = x^e-c_2
\end{cases}$$

Rõ ràng, $m_2$ chính là nghiệm của hai đa thức trên. Vì vậy khi này $g_1(x), g_2(x)$ có thể được biểu diễn dưới dạng :

$$\begin{cases}
g_1(x) = (x - m_2)\times h(x)\\
g_2(x) = (x - m_2)\times k(x)
\end{cases}$$

Tính $gcd(g_1(x), g_2(x))$ ta sẽ thu về đa thức là $x-m_2$. Và từ $m_2$ ta sẽ biết được $m_1$. Như vậy là đã khôi phục được $m_1, m_2$

Cho ví dụ : 
```python
n = 68007326677123246855707509021929485918262392646245153968636369177958002263252150394862511754489257164799872563691509793233359811292834044386797899774459719385291291786061631482155775076849283214761442119636868351483847755567247145916829462488162526011687463279702448822423846544508858429582655001573846966299
e = 11
c1 = 3159267829959640630802384707593395329177253033536953466620232231296040007516225718163378216922538797476739250190027969907253177312088023051078852131251322639661013679807543259237032863511445620076733726920794749552107456327494453778930293694198601969921916195106576840593482826787853436552108243341230749570
c2 = 1024542717087240176773064440763362318931094388504125006051408155280875675126185677011598560264179115624510427125984885119079572481500320308088239959231648810030205169019007463993823688138673032934003621186245617202941083514867577006956258537301257783589746088279118308493071608725691582100394197487030898255

#Given : m2 = a*m1 + b 
a = 30814223209559653
b = 4884502491372219560879160938162303598227406622417219546947279500681239184181782
```

Với việc đề cho mối quan hệ giữa $m_1$ và $m_2$ ta xét hệ phương trình sau :

$$\begin{cases}
c_1 \equiv m_1^e \mod(N)\\
c_2 \equiv m_2^e \mod(N)
\end{cases}$$

$$\Leftrightarrow \begin{cases}
m_1^e-c_1\equiv 0 \mod(N)\\
m_2^e-c_2 \equiv 0\mod(N)
\end{cases}$$

$$\Leftrightarrow \begin{cases}
m_1^e-c_1\equiv 0 \mod(N)\\
(a.m_1 + b)^e-c_2 \equiv 0\mod(N)
\end{cases}$$

Đặt :

$$\begin{cases}
g_1(x) = x^e-c_1\\
g_2(x) = (a.x + b)^e-c_2
\end{cases}$$

Với $x=m_1$ là nghiệm của hệ phương trình thì ta có :

$$\begin{cases}
g_1(x) = (x - m_1)\times h(x)\\
g_2(x) = (x - m_1)\times k(x)\\
\end{cases}$$

$$\Rightarrow gcd(g_1(x), g_2(x)) = x - m_1$$

Ở đây mình sẽ dùng **[tools](https://github.com/ashutosh1206/Crypton/blob/master/RSA-encryption/Attack-Franklin-Reiter/exploit.sage)** để giải bài này. Có được $m_1$ thì chỉ cần decode nữa là xong.



Vì sợ rằng sẽ không đủ chỗ để viết các challenge CryptoHack nên mình sẽ viết vào một note khác. Các bạn có thể xem **[ở đây.](https://youtu.be/On05yEFt41M?si=uku2bnE6yx8dE7Fi)**
