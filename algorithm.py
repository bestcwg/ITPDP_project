import functional_dependencies as FD
from functional_dependencies.functional_dependencies import FDSet

#data = {"A","B","C","D","E","F","G","H","I","J"}

fd1 = FD.FD("A","B")
fd2 = FD.FD("A","D")
fd3 = FD.FD("B","F")
fd4 = FD.FD("F","G")
fd5 = FD.FD("D","I")

data = {fd1, fd2, fd3, fd4, fd5}

fd1set = fd1.rminimize()

print(fd1set)
print(len(fd1set) == 1)
print(fd1.attributes() == {"A","B"})