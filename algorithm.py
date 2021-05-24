import functional_dependencies as FD
from functional_dependencies.functional_dependencies import FDSet

data = {"A","B","C","D","E"}

fd1 = FD.FD({"A"},{"B","C","D"})
#fd2 = FD.FD("A","E")

fd1set = fd1.rminimize()

print(fd1set)
print(len(fd1set) == 3)
print(fd1.attributes())
print(FDSet.key(fd1set))
print(FDSet.closure(fd1set))

