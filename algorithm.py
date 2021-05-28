import functional_dependencies as FD
from functional_dependencies.functional_dependencies import FDSet, RelSchema

data = {"A","B","C","D","E"}
fds = FDSet()
fds.add(FD.FD({"A"},{"B","C","D"}))
fds.add(FD.FD({"E"},{"E"}))
#fd2 = FD.FD("A","E")

fd1set = RelSchema(fds.attributes(),fds)

print(fd1set)
#print(len(fd1set) == 3)
print(fds.attributes())
print(fd1set.key() == {"A", "E"})
normalize = fd1set.synthesize()
print(len(normalize) == 1)
print(normalize)
#print(FDSet.key(fd1set) == {"A"})
#print(FDSet.basis(fd1set))
#skema = RelSchema(fds.attributes(),fds)
#normalization = skema.synthesize()
#print(len(normalization))
